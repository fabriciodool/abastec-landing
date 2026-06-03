const brands = [
  { name: "Brastemp", abbr: "BSH" },
  { name: "Electrolux", abbr: "ELX" },
  { name: "Consul", abbr: "CNS" },
  { name: "LG", abbr: "LG" },
  { name: "Samsung", abbr: "SSG" },
  { name: "General Electric", abbr: "GE" },
];

export default function BrandsSection() {
  return (
    <section className="bg-white py-14 sm:py-16 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">Marcas nacionais atendidas</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Atendimento técnico para os principais eletrodomésticos de linha branca das marcas
            mais presentes nos lares brasileiros.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="card flex flex-col items-center justify-center gap-2 p-5 text-center transition-shadow hover:shadow-card-hover"
            >
              <div className="h-12 w-12 rounded-full bg-brand-light flex items-center justify-center">
                <span className="text-xs font-bold text-brand-blue tracking-tight">
                  {brand.abbr}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{brand.name}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
          As marcas citadas são utilizadas apenas para identificação dos equipamentos atendidos.
          A Abastec presta assistência técnica independente, salvo quando houver autorização formal
          comprovada.
        </p>
      </div>
    </section>
  );
}
