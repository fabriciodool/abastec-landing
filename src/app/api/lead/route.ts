import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Rate limit simples em memória (por IP) ──────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Marcas e produtos permitidos ────────────────────────────────────────────
const MARCAS_PERMITIDAS = new Set([
  "Brastemp", "Electrolux", "Consul", "LG", "Samsung", "General Electric",
]);
const PRODUTOS_PERMITIDOS = new Set([
  "Geladeira / Refrigerador", "Freezer", "Side by Side", "Lavadora",
  "Lava e Seca", "Secadora", "Lava-louças", "Fogão", "Cooktop", "Forno",
  "Micro-ondas", "Coifa", "Outro eletrodoméstico de linha branca",
]);

// ─── Sanitização ─────────────────────────────────────────────────────────────
function sanitize(value: unknown, maxLen = 200): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>"&]/g, "").trim().slice(0, maxLen);
}

function sanitizePhone(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\D/g, "").slice(0, 11);
}

function sanitizeCep(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\D/g, "").slice(0, 8);
}

// ─── Formatadores ─────────────────────────────────────────────────────────────
function formatPhone(digits: string): string {
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits;
}

function formatCep(digits: string): string {
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

// ─── Validação backend ────────────────────────────────────────────────────────
interface ValidationResult {
  ok: boolean;
  message?: string;
}

function validate(body: Record<string, unknown>): ValidationResult {
  if (!MARCAS_PERMITIDAS.has(body.marca as string))
    return { ok: false, message: "Marca inválida." };
  if (!PRODUTOS_PERMITIDOS.has(body.produto as string))
    return { ok: false, message: "Produto inválido." };

  const nome = sanitize(body.nome).replace(/\s+/g, " ");
  if (nome.length < 2 || /^\d+$/.test(nome))
    return { ok: false, message: "Nome inválido." };

  const phone = sanitizePhone(body.whatsapp);
  if (phone.length < 10 || phone.length > 11)
    return { ok: false, message: "WhatsApp inválido." };

  const cep = sanitizeCep(body.cep);
  if (cep.length !== 8) return { ok: false, message: "CEP inválido." };

  // honeypot check
  if (body.empresa_site) return { ok: false, message: "Envio bloqueado." };

  return { ok: true };
}

// ─── HTML do e-mail ───────────────────────────────────────────────────────────
function buildEmailHtml(data: Record<string, string>): string {
  const rows = [
    ["Marca", data.marca],
    ["Produto", data.produto],
    ["Nome", data.nome],
    ["WhatsApp", data.whatsapp_fmt],
    ["CEP de atendimento", data.cep_fmt],
    ["LP", data.lp],
    ["URL da página", data.landing_page],
    ["Referrer", data.referrer],
    ["UTM Source", data.utm_source],
    ["UTM Medium", data.utm_medium],
    ["UTM Campaign", data.utm_campaign],
    ["UTM Term", data.utm_term],
    ["UTM Content", data.utm_content],
    ["GCLID", data.gclid],
    ["GBRAID", data.gbraid],
    ["WBRAID", data.wbraid],
    ["Data/hora", data.timestamp],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px;font-weight:600;background:#f3f4f6;border:1px solid #e5e7eb;white-space:nowrap;">${label}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;">${value || "—"}</td>
        </tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8" /></head>
    <body style="font-family:Arial,sans-serif;color:#111827;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#1a4fb0;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:18px;">Novo lead — LP Abastec</h1>
        <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px;">Marcas Nacionais</p>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${tableRows}
        </table>
      </div>
    </body>
    </html>
  `;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Muitas tentativas. Aguarde um momento e tente novamente." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Dados inválidos." },
      { status: 400 }
    );
  }

  const validation = validate(body);
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, message: validation.message },
      { status: 400 }
    );
  }

  const nome = sanitize(body.nome).replace(/\s+/g, " ");
  const marca = sanitize(body.marca);
  const produto = sanitize(body.produto);
  const phone = sanitizePhone(body.whatsapp);
  const cep = sanitizeCep(body.cep);
  const phoneFmt = formatPhone(phone);
  const cepFmt = formatCep(cep);

  const emailData: Record<string, string> = {
    lp: "abastec-nacionais",
    marca,
    produto,
    nome,
    whatsapp_fmt: phoneFmt,
    cep_fmt: cepFmt,
    landing_page: sanitize(body.landing_page, 500),
    referrer: sanitize(body.referrer, 500),
    utm_source: sanitize(body.utm_source),
    utm_medium: sanitize(body.utm_medium),
    utm_campaign: sanitize(body.utm_campaign),
    utm_term: sanitize(body.utm_term),
    utm_content: sanitize(body.utm_content),
    gclid: sanitize(body.gclid),
    gbraid: sanitize(body.gbraid),
    wbraid: sanitize(body.wbraid),
    timestamp: sanitize(body.timestamp, 30),
  };

  // ── Envio de e-mail ──────────────────────────────────────────────────────
  const {
    SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS,
    SMTP_FROM, LEAD_EMAIL_TO, WHATSAPP_NUMBER_ABASTEC,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_EMAIL_TO || !WHATSAPP_NUMBER_ABASTEC) {
    console.error("[lead] Variáveis de ambiente SMTP ou WhatsApp não configuradas.");
    return NextResponse.json(
      { success: false, message: "Serviço temporariamente indisponível. Tente novamente." },
      { status: 500 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT ?? "587"),
      secure: SMTP_SECURE === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `[Lead LP Abastec] ${marca} — ${produto} — CEP ${cepFmt}`;

    const textBody = [
      "Novo lead recebido pela LP Abastec - Marcas Nacionais",
      "",
      `Marca: ${marca}`,
      `Produto: ${produto}`,
      `Nome: ${nome}`,
      `WhatsApp: ${phoneFmt}`,
      `CEP de atendimento: ${cepFmt}`,
      "",
      "Origem:",
      `LP: abastec-nacionais`,
      `URL da página: ${emailData.landing_page}`,
      `Referrer: ${emailData.referrer}`,
      `UTM Source: ${emailData.utm_source}`,
      `UTM Medium: ${emailData.utm_medium}`,
      `UTM Campaign: ${emailData.utm_campaign}`,
      `UTM Term: ${emailData.utm_term}`,
      `UTM Content: ${emailData.utm_content}`,
      `GCLID: ${emailData.gclid}`,
      `GBRAID: ${emailData.gbraid}`,
      `WBRAID: ${emailData.wbraid}`,
      `Data/hora: ${emailData.timestamp}`,
    ].join("\n");

    await transporter.sendMail({
      from: SMTP_FROM ?? SMTP_USER,
      to: LEAD_EMAIL_TO,
      subject,
      text: textBody,
      html: buildEmailHtml(emailData),
    });
  } catch (err) {
    console.error("[lead] Erro ao enviar e-mail:", err);
    // Não bloqueamos a conversão — logamos o erro e continuamos
  }

  // ── Mensagem WhatsApp ────────────────────────────────────────────────────
  const waMessage = encodeURIComponent(
    `Olá, vim pela página da Abastec e quero solicitar atendimento técnico.\n\nMarca: ${marca}\nProduto: ${produto}\nNome: ${nome}\nWhatsApp: ${phoneFmt}\nCEP de atendimento: ${cepFmt}\n\nAguardo retorno para agendar uma visita técnica.`
  );

  const redirectUrl = `https://wa.me/${WHATSAPP_NUMBER_ABASTEC}?text=${waMessage}`;

  return NextResponse.json({ success: true, redirectUrl });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
