"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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
  empresa_site: string; // honeypot
}

interface FormErrors {
  marca?: string;
  produto?: string;
  nome?: string;
  whatsapp?: string;
  cep?: string;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
}

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function isInvalidPhone(raw: string): boolean {
  const invalid = ["00000000000", "11111111111", "22222222222", "33333333333",
    "44444444444", "55555555555", "66666666666", "77777777777",
    "88888888888", "99999999999"];
  return invalid.includes(raw);
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.marca) errors.marca = "Selecione a marca do equipamento.";
  if (!data.produto) errors.produto = "Selecione o produto.";

  const nome = data.nome.replace(/\s+/g, " ").trim();
  if (!nome) errors.nome = "Informe seu nome.";
  else if (nome.length < 2) errors.nome = "Nome muito curto.";
  else if (/^\d+$/.test(nome)) errors.nome = "Informe um nome válido.";

  const rawPhone = data.whatsapp.replace(/\D/g, "");
  if (!rawPhone) errors.whatsapp = "Informe seu WhatsApp com DDD.";
  else if (rawPhone.length < 10 || rawPhone.length > 11)
    errors.whatsapp = "WhatsApp inválido. Use o formato (11) 99999-9999.";
  else if (isInvalidPhone(rawPhone)) errors.whatsapp = "WhatsApp inválido.";

  const rawCep = data.cep.replace(/\D/g, "");
  if (!rawCep) errors.cep = "Informe o CEP de atendimento.";
  else if (rawCep.length !== 8) errors.cep = "CEP deve ter 8 dígitos.";

  return errors;
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "gclid", "gbraid", "wbraid"];
  const result: Record<string, string> = {};
  for (const f of fields) result[f] = params.get(f) ?? "";
  return result;
}

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>({
    marca: "",
    produto: "",
    nome: "",
    whatsapp: "",
    cep: "",
    empresa_site: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [formStarted, setFormStarted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const pushDataLayer = useCallback((event: string, extra?: Record<string, unknown>) => {
    window.dataLayer ??= [];
    window.dataLayer.push({ event, lp: "abastec-nacionais", ...extra });
  }, []);

  const handleFirstInteraction = useCallback(() => {
    if (!formStarted) {
      setFormStarted(true);
      pushDataLayer("lead_form_start");
    }
  }, [formStarted, pushDataLayer]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    handleFirstInteraction();
    const { name, value } = e.target;

    let processed = value;
    if (name === "whatsapp") processed = maskPhone(value);
    if (name === "cep") processed = maskCep(value);

    setFormData((prev) => ({ ...prev, [name]: processed }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // honeypot check — bot preencheu o campo oculto
    if (formData.empresa_site) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`)
        ?.focus();
      return;
    }

    setStatus("loading");
    setServerError("");

    const utms = getUtmParams();
    const payload = {
      lp: "abastec-nacionais",
      marca: formData.marca,
      produto: formData.produto,
      nome: formData.nome.replace(/\s+/g, " ").trim(),
      whatsapp: formData.whatsapp.replace(/\D/g, ""),
      cep: formData.cep.replace(/\D/g, ""),
      ...utms,
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
        pushDataLayer("lead_form_submit_success", {
          brand: formData.marca,
          product: formData.produto,
        });
        pushDataLayer("whatsapp_redirect", {
          brand: formData.marca,
          product: formData.produto,
        });
        window.location.href = json.redirectUrl;
      } else {
        setStatus("error");
        setServerError(
          json.message ?? "Ocorreu um erro. Tente novamente ou fale pelo WhatsApp."
        );
      }
    } catch {
      setStatus("error");
      setServerError("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Solicitar atendimento técnico</h2>
        <p className="text-sm text-gray-500 mt-1">
          Preencha os dados abaixo para continuar pelo WhatsApp.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-label="Formulário de solicitação de atendimento"
      >
        {/* Honeypot — invisível para humanos */}
        <div aria-hidden="true" className="hidden" tabIndex={-1}>
          <label htmlFor="empresa_site">Website da empresa</label>
          <input
            id="empresa_site"
            name="empresa_site"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.empresa_site}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-4">
          {/* Marca */}
          <div>
            <label htmlFor="marca" className="form-label">
              Marca do equipamento <span className="text-red-500" aria-hidden>*</span>
            </label>
            <select
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className={`form-input ${errors.marca ? "form-input-error" : ""}`}
              aria-required="true"
              aria-describedby={errors.marca ? "marca-error" : undefined}
            >
              <option value="">Selecione a marca</option>
              {MARCAS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.marca && (
              <p id="marca-error" className="form-error" role="alert">{errors.marca}</p>
            )}
          </div>

          {/* Produto */}
          <div>
            <label htmlFor="produto" className="form-label">
              Produto <span className="text-red-500" aria-hidden>*</span>
            </label>
            <select
              id="produto"
              name="produto"
              value={formData.produto}
              onChange={handleChange}
              className={`form-input ${errors.produto ? "form-input-error" : ""}`}
              aria-required="true"
              aria-describedby={errors.produto ? "produto-error" : undefined}
            >
              <option value="">Selecione o produto</option>
              {PRODUTOS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.produto && (
              <p id="produto-error" className="form-error" role="alert">{errors.produto}</p>
            )}
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="nome" className="form-label">
              Seu nome <span className="text-red-500" aria-hidden>*</span>
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Como podemos te chamar?"
              value={formData.nome}
              onChange={handleChange}
              className={`form-input ${errors.nome ? "form-input-error" : ""}`}
              aria-required="true"
              aria-describedby={errors.nome ? "nome-error" : undefined}
            />
            {errors.nome && (
              <p id="nome-error" className="form-error" role="alert">{errors.nome}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="form-label">
              WhatsApp (com DDD) <span className="text-red-500" aria-hidden>*</span>
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              value={formData.whatsapp}
              onChange={handleChange}
              inputMode="tel"
              className={`form-input ${errors.whatsapp ? "form-input-error" : ""}`}
              aria-required="true"
              aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            />
            {errors.whatsapp && (
              <p id="whatsapp-error" className="form-error" role="alert">{errors.whatsapp}</p>
            )}
          </div>

          {/* CEP */}
          <div>
            <label htmlFor="cep" className="form-label">
              CEP de atendimento <span className="text-red-500" aria-hidden>*</span>
            </label>
            <input
              id="cep"
              name="cep"
              type="text"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={formData.cep}
              onChange={handleChange}
              inputMode="numeric"
              className={`form-input ${errors.cep ? "form-input-error" : ""}`}
              aria-required="true"
              aria-describedby={errors.cep ? "cep-error" : undefined}
            />
            {errors.cep && (
              <p id="cep-error" className="form-error" role="alert">{errors.cep}</p>
            )}
          </div>
        </div>

        {/* Erro de servidor */}
        {status === "error" && serverError && (
          <div
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-lg w-full mt-6"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75 3.75 7.444 3.75 12s3.694 8.25 8.25 8.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12l2.25 2.25 4.5-4.5" />
              </svg>
              Solicitar atendimento técnico
            </>
          )}
        </button>

        {/* LGPD */}
        <p className="mt-3 text-xs text-gray-500 text-center leading-relaxed">
          Ao enviar, você autoriza o contato da equipe Abastec pelo WhatsApp informado para tratar
          da sua solicitação de atendimento técnico.{" "}
          <a href="/politica-de-privacidade" className="underline hover:text-brand-blue">
            Política de Privacidade
          </a>
          .
        </p>
      </form>
    </div>
  );
}
