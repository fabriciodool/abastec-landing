const products = [
  { name: "Geladeira / Refrigerador", icon: "🧊" },
  { name: "Freezer", icon: "❄️" },
  { name: "Side by Side", icon: "🚪" },
  { name: "Lavadora", icon: "🫧" },
  { name: "Lava e Seca", icon: "💧" },
  { name: "Secadora", icon: "🌀" },
  { name: "Lava-louças", icon: "🍽️" },
  { name: "Fogão", icon: "🔥" },
  { name: "Cooktop", icon: "⚡" },
  { name: "Forno", icon: "🥘" },
  { name: "Micro-ondas", icon: "📡" },
  { name: "Coifa", icon: "💨" },
];

export default function ProductsSection() {
  return (
    <section className="bg-gray-50 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">Produtos que atendemos</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Geladeiras, lavadoras, lava e seca, fogões, fornos, cooktops, micro-ondas, coifas e
            outros eletrodomésticos de linha branca.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-card-hover"
            >
              <span className="text-2xl flex-shrink-0" aria-hidden>
                {product.icon}
              </span>
              <span className="text-sm font-medium text-gray-800 leading-tight">
                {product.name}
              </span>
            </div>
          ))}

          {/* Card especial */}
          <div className="card flex items-center gap-3 p-4 border-dashed border-brand-blue/30 bg-brand-light transition-shadow hover:shadow-card-hover">
            <span className="text-2xl flex-shrink-0" aria-hidden>➕</span>
            <span className="text-sm font-medium text-brand-blue leading-tight">
              Outro eletrodoméstico de linha branca
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
