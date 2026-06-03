"use client";

import { useState } from "react";

const faqs = [
  {
    question: "A Abastec é autorizada das marcas citadas?",
    answer:
      "As marcas são citadas para identificação dos equipamentos atendidos. A Abastec atua como assistência técnica independente, salvo quando houver autorização formal específica.",
  },
  {
    question: "Quais eletrodomésticos vocês atendem?",
    answer:
      "Atendemos eletrodomésticos de linha branca, como geladeiras, lavadoras, lava e seca, secadoras, fogões, fornos, cooktops, micro-ondas, coifas e equipamentos similares.",
  },
  {
    question: "O atendimento é feito na residência?",
    answer:
      "Em muitos casos, sim. A confirmação depende do produto, da região e da disponibilidade técnica.",
  },
  {
    question: "Vocês atendem equipamentos na garantia?",
    answer:
      "Para equipamentos em garantia de fábrica, o ideal é consultar diretamente o fabricante ou a rede autorizada oficial. A Abastec realiza atendimentos técnicos independentes conforme o caso.",
  },
  {
    question: "Como solicito atendimento?",
    answer:
      "Preencha o formulário com marca, produto, nome, WhatsApp e CEP. Após o envio, você será direcionado ao WhatsApp com os dados da solicitação.",
  },
  {
    question: "Vocês atendem em qual região?",
    answer:
      "Atendemos em São Paulo e regiões selecionadas, conforme disponibilidade técnica e confirmação do CEP informado no formulário.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = question.replace(/\s+/g, "-").toLowerCase().slice(0, 40);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-sm font-semibold text-gray-900 sm:text-base">{question}</span>
        <span className="flex-shrink-0 mt-0.5" aria-hidden>
          <svg
            className={`h-5 w-5 text-brand-blue transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      <div
        id={id}
        role="region"
        aria-hidden={!open}
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"}`}
      >
        <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-gray-50 py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">Perguntas frequentes</h2>
          <p className="section-subtitle">
            Tire suas dúvidas antes de solicitar o atendimento.
          </p>
        </div>

        <div className="card px-6 divide-y divide-gray-100">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
