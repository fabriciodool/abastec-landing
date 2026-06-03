import LeadForm from "./LeadForm";

const benefits = [
  "Atendimento técnico especializado",
  "Agendamento rápido",
  "Equipe experiente em linha branca",
  "Atendimento residencial mediante disponibilidade de cobertura",
];

export default function HeroSection() {
  return (
    <section className="pt-16 bg-gradient-to-br from-brand-light via-white to-blue-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Coluna esquerda — copy */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 mb-5 w-fit">
              <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-wide">
                São Paulo e região
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-gray-900 leading-tight tracking-tight">
              Assistência técnica para{" "}
              <span className="text-brand-blue">eletrodomésticos nacionais</span>{" "}
              em São Paulo
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Solicite atendimento para equipamentos Brastemp, Electrolux, Consul, LG, Samsung e
              General Electric com uma equipe técnica experiente em linha branca.
            </p>

            <ul className="mt-6 space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-gray-700 text-sm sm:text-base">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-blue"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-gray-500">
              Preencha os dados e siga para o WhatsApp com sua solicitação já organizada.
            </p>
          </div>

          {/* Coluna direita — formulário */}
          <div id="formulario" className="scroll-mt-20">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
