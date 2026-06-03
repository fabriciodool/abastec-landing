export default function CoverageSection() {
  return (
    <section className="bg-white py-14 sm:py-16 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-brand-light mb-5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-7 w-7 text-brand-blue"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>

          <h2 className="section-title">Área de cobertura</h2>

          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Atendimento em{" "}
            <strong className="text-gray-900">São Paulo e regiões selecionadas</strong>,
            conforme disponibilidade técnica e confirmação do CEP informado.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Capital", desc: "São Paulo — SP" },
              { label: "Grande SP", desc: "Regiões selecionadas" },
              { label: "Confirmação", desc: "Via CEP no formulário" },
            ].map((item) => (
              <div key={item.label} className="card p-5 text-center">
                <p className="text-sm font-semibold text-brand-blue mb-1">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-gray-400">
            O CEP informado no formulário é verificado pela equipe para confirmar a disponibilidade
            de atendimento na sua região.
          </p>
        </div>
      </div>
    </section>
  );
}
