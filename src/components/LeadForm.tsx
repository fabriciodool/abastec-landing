"use client";

import { useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const MARCAS = ["Brastemp", "Electrolux", "Consul", "LG", "Samsung", "General Electric"];

const PRODUTOS = [
  "Geladeira / Refrigerador",
  "Freezer",
  "Side by Side",
  "Lavadora",
  "Lava e Seca",
  "Secadora",
  "Lava-louças",
  "Fogão",
  "Cooktop",
  "Forno",
  "Micro-ondas",
  "Coifa",
  "Outro eletrodoméstico de linha branca",
];

interface FormData {
  marca: string;
  produto: string;
  nome: string;
  whatsapp: string;
  cep: string;
  empresa_site: string;
}

interface FormErrors {
  marca?: string;
  produto?: string;
  nome?: string;
  whatsapp?: string;
  cep?: string;
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCep(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

function isInvalidPhone(raw: string): boolean {
  return /^(\d)\1{9,10}$/.test(raw);
}

function validateStep1(data: FormData): FormErrors {
  const e: FormErrors = {};
  if (!data.marca) e.marca = "Selecione a marca.";
  if (!data.produto) e.produto = "Selecione o produto.";
  return e;
}

function validateStep2(data: FormData): FormErrors {
  const e: FormErrors = {};
  const nome = data.nome.replace(/\s+/g, " ").trim();
  if (!nome || nome.length < 2 || /^\d+$/.test(nome)) e.nome = "Informe seu nome.";
  const raw = data.whatsapp.replace(/\D/g, "");
  if (!raw || raw.length < 10 || raw.length > 11 || isInvalidPhone(raw))
    e.whatsapp = "WhatsApp inválido.";
  const cep = data.cep.replace(/\D/g, "");
  if (cep.length !== 8) e.cep = "CEP deve ter 8 dígitos.";
  return e;
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const fields = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","gbraid","wbraid"];
  return Object.fromEntries(fields.map((f) => [f, p.get(f) ?? ""]));
}

export default function LeadForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    marca: "", produto: "", nome: "", whatsapp: "", cep: "", empresa_site: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [started, setStarted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const push = useCallback((event: string, extra?: Record<string, unknown>) => {
    window.dataLayer ??= [];
    window.dataLayer.push({ event, lp: "abastec-nacionais", ...extra });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!started) { setStarted(true); push("lead_form_start"); }
    const { name, value } = e.target;
    let v = value;
    if (name === "whatsapp") v = maskPhone(value);
    if (name === "cep") v = maskCep(value);
    setFormData((p) => ({ ...p, [name]: v }));
    if (errors[name as keyof FormErrors]) setErrors((p) => ({ ...p, [name]: undefined }));
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep1(formData);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
    setTimeout(() => formRef.current?.querySelector<HTMLElement>("[name='nome']")?.focus(), 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.empresa_site) return;
    const errs = validateStep2(formData);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");

    const payload = {
      lp: "abastec-nacionais",
      marca: formData.marca,
      produto: formData.produto,
      nome: formData.nome.replace(/\s+/g, " ").trim(),
      whatsapp: formData.whatsapp.replace(/\D/g, ""),
      cep: formData.cep.replace(/\D/g, ""),
      ...getUtmParams(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
      landing_page: typeof window !== "undefined" ? window.location.href : "",
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success && json.redirectUrl) {
        push("lead_form_submit_success", { brand: formData.marca, product: formData.produto });
        push("whatsapp_redirect", { brand: formData.marca, product: formData.produto });
        window.location.href = json.redirectUrl;
      } else {
        setServerError(json.message ?? "Erro ao enviar. Tente novamente.");
        setLoading(false);
      }
    } catch {
      setServerError("Erro de conexão. Verifique sua internet.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Indicador de etapas */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= n ? "bg-brand-blue text-white" : "bg-white/30 text-white/70"
              }`}
            >
              {n}
            </div>
            {n < 2 && (
              <div className={`h-px w-8 transition-all ${step >= 2 ? "bg-brand-blue" : "bg-white/30"}`} />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-white/70">
          {step === 1 ? "Equipamento" : "Seus dados"}
        </span>
      </div>

      <form
        ref={formRef}
        onSubmit={step === 1 ? handleNext : handleSubmit}
        noValidate
        aria-label="Formulário de solicitação de atendimento"
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Honeypot */}
        <div aria-hidden className="hidden" tabIndex={-1}>
          <input name="empresa_site" tabIndex={-1} autoComplete="off"
            value={formData.empresa_site} onChange={handleChange} />
        </div>

        <div className="p-5 sm:p-6">
          {step === 1 ? (
            /* ── Etapa 1 ── */
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Qual equipamento precisa de atendimento?</p>

              <div>
                <label htmlFor="marca" className="form-label">
                  Marca <span className="text-red-500" aria-hidden>*</span>
                </label>
                <select
                  id="marca" name="marca" value={formData.marca} onChange={handleChange}
                  className={`form-input text-base ${errors.marca ? "form-input-error" : ""}`}
                  aria-required="true"
                >
                  <option value="">Selecione a marca</option>
                  {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.marca && <p className="form-error" role="alert">{errors.marca}</p>}
              </div>

              <div>
                <label htmlFor="produto" className="form-label">
                  Produto <span className="text-red-500" aria-hidden>*</span>
                </label>
                <select
                  id="produto" name="produto" value={formData.produto} onChange={handleChange}
                  className={`form-input text-base ${errors.produto ? "form-input-error" : ""}`}
                  aria-required="true"
                >
                  <option value="">Selecione o produto</option>
                  {PRODUTOS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.produto && <p className="form-error" role="alert">{errors.produto}</p>}
              </div>
            </div>
          ) : (
            /* ── Etapa 2 ── */
            <div className="space-y-4">
              {/* Resumo da etapa 1 */}
              <button
                type="button"
                onClick={() => { setStep(1); setErrors({}); }}
                className="flex items-center gap-2 text-xs text-brand-blue hover:underline mb-1"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                {formData.marca} — {formData.produto}
              </button>

              <p className="text-sm font-semibold text-gray-700">Agora seus dados para contato:</p>

              <div>
                <label htmlFor="nome" className="form-label">
                  Seu nome <span className="text-red-500" aria-hidden>*</span>
                </label>
                <input
                  id="nome" name="nome" type="text" autoComplete="name"
                  placeholder="Como podemos te chamar?"
                  value={formData.nome} onChange={handleChange}
                  className={`form-input text-base ${errors.nome ? "form-input-error" : ""}`}
                  aria-required="true"
                />
                {errors.nome && <p className="form-error" role="alert">{errors.nome}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="form-label">
                  WhatsApp <span className="text-red-500" aria-hidden>*</span>
                </label>
                <input
                  id="whatsapp" name="whatsapp" type="tel" autoComplete="tel"
                  placeholder="(11) 99999-9999" inputMode="tel"
                  value={formData.whatsapp} onChange={handleChange}
                  className={`form-input text-base ${errors.whatsapp ? "form-input-error" : ""}`}
                  aria-required="true"
                />
                {errors.whatsapp && <p className="form-error" role="alert">{errors.whatsapp}</p>}
              </div>

              <div>
                <label htmlFor="cep" className="form-label">
                  CEP de atendimento <span className="text-red-500" aria-hidden>*</span>
                </label>
                <input
                  id="cep" name="cep" type="text" autoComplete="postal-code"
                  placeholder="00000-000" inputMode="numeric"
                  value={formData.cep} onChange={handleChange}
                  className={`form-input text-base ${errors.cep ? "form-input-error" : ""}`}
                  aria-required="true"
                />
                {errors.cep && <p className="form-error" role="alert">{errors.cep}</p>}
              </div>

              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {serverError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botão */}
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-lg w-full"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Enviando...
              </>
            ) : step === 1 ? (
              <>
                Continuar
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.86L.057 23.012a.75.75 0 00.921.921l5.152-1.475A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.524-5.2-1.435l-.373-.22-3.862 1.107 1.107-3.862-.22-.373A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Solicitar pelo WhatsApp
              </>
            )}
          </button>

          {step === 2 && (
            <p className="mt-3 text-xs text-gray-400 text-center leading-relaxed">
              Ao enviar, você autoriza o contato da equipe Abastec pelo WhatsApp informado.{" "}
              <a href="/politica-de-privacidade" className="underline hover:text-brand-blue">Privacidade</a>.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
