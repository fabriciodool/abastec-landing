import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal | Abastec",
  robots: "noindex",
};

export default function AvisoLegal() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-brand-blue hover:underline mb-8 inline-block">
          ← Voltar à página principal
        </Link>

        <div className="bg-white rounded-xl shadow-card p-8 sm:p-10 prose prose-gray max-w-none">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aviso Legal</h1>
          <p className="text-sm text-gray-500 mb-6">Última atualização: junho de 2025</p>

          <h2>Independência de marcas</h2>
          <p>
            As marcas Brastemp, Electrolux, Consul, LG, Samsung e General Electric são marcas
            registradas de seus respectivos proprietários. A menção a essas marcas neste site tem
            como único objetivo identificar os tipos de equipamentos para os quais a Abastec
            oferece assistência técnica.
          </p>
          <p>
            <strong>A Abastec não é assistência técnica autorizada oficial de nenhuma das marcas
            citadas</strong>, salvo quando houver autorização formal e documentada. Não utilizamos
            os termos "autorizada", "assistência oficial", "suporte oficial da marca" ou similares
            sem comprovação formal.
          </p>

          <h2>Garantia de fábrica</h2>
          <p>
            Para equipamentos ainda dentro do prazo de garantia de fábrica, recomendamos consultar
            diretamente o fabricante ou a rede de assistência técnica autorizada oficial. A Abastec
            realiza atendimentos técnicos independentes, podendo haver cobrança de visita e reparo
            conforme o caso.
          </p>

          <h2>Resultado do atendimento</h2>
          <p>
            O preenchimento do formulário e o contato via WhatsApp não garantem reparo, conserto
            imediato ou orçamento gratuito. O resultado depende de avaliação técnica presencial.
          </p>

          <h2>Contato</h2>
          <p>
            <a href="mailto:contato@abastec.com.br">contato@abastec.com.br</a>
          </p>
        </div>
      </div>
    </main>
  );
}
