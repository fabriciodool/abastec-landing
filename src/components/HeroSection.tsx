import LeadForm from "./LeadForm";

export default function HeroSection() {
  return (
    <section className="relative pt-16 min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Fundo — troque por <Image> com foto real quando disponível */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a1f4e] via-[#1a4fb0] to-[#1e6fd4]"
        aria-hidden
      />

      {/* Overlay com textura sutil */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-lg px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
            São Paulo e região
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
          Assistência técnica para
          <br />
          <span className="text-blue-200">eletrodomésticos nacionais</span>
        </h1>

        <p className="text-sm sm:text-base text-blue-100 max-w-sm mb-8 leading-relaxed">
          Brastemp, Electrolux, Consul, LG, Samsung e General Electric.
          Preencha em 30 segundos e fale com nossa equipe pelo WhatsApp.
        </p>

        {/* Formulário 2 etapas */}
        <div id="formulario" className="w-full scroll-mt-20">
          <LeadForm />
        </div>

        {/* Social proof */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-blue-200">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Atendimento residencial
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Equipe técnica especializada
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Agendamento rápido
          </span>
        </div>
      </div>

      {/* Onda decorativa na base */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
