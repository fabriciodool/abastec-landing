const steps = [
  {
    number: "01",
    title: "Você informa marca, produto e CEP",
    description:
      "Preencha o formulário com os dados do equipamento e sua localização. Leva menos de 1 minuto.",
  },
  {
    number: "02",
    title: "A equipe recebe sua solicitação",
    description:
      "Seus dados chegam organizados diretamente para a equipe de atendimento via WhatsApp.",
  },
  {
    number: "03",
    title: "Confirmamos região e disponibilidade",
    description:
      "O atendimento verifica a cobertura para o CEP informado e a disponibilidade técnica.",
  },
  {
    number: "04",
    title: "O técnico realiza a avaliação",
    description:
      "Conforme agendamento, o técnico especializado vai até o local para avaliar o equipamento.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-14 sm:py-16 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">Como funciona</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Um processo simples, transparente e organizado do início ao fim.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col">
              {/* Linha conectora (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 left-[calc(50%+28px)] right-0 h-px bg-brand-blue/20"
                  aria-hidden
                />
              )}

              <div className="flex flex-col items-center text-center p-6 card">
                <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-sm font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
