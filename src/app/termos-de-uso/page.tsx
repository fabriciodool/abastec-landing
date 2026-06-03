import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | Abastec",
  robots: "noindex",
};

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-brand-blue hover:underline mb-8 inline-block">
          ← Voltar à página principal
        </Link>

        <div className="bg-white rounded-xl shadow-card p-8 sm:p-10 prose prose-gray max-w-none">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-sm text-gray-500 mb-6">Última atualização: junho de 2025</p>

          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao acessar e utilizar esta página, você concorda com os presentes Termos de Uso. Caso
            não concorde com alguma cláusula, não utilize o formulário de solicitação.
          </p>

          <h2>2. Natureza do serviço</h2>
          <p>
            Esta página tem como único objetivo facilitar o contato inicial entre o usuário e a
            equipe de atendimento da Abastec para solicitação de assistência técnica em
            eletrodomésticos de linha branca.
          </p>
          <p>
            O preenchimento do formulário não garante disponibilidade de atendimento, diagnóstico
            ou reparo. A confirmação do serviço depende da análise da equipe técnica conforme
            produto, marca e região informados.
          </p>

          <h2>3. Marcas de terceiros</h2>
          <p>
            As marcas Brastemp, Electrolux, Consul, LG, Samsung e General Electric são
            propriedade de seus respectivos fabricantes e são mencionadas nesta página apenas para
            identificação dos equipamentos atendidos. A Abastec não possui vínculo oficial com
            essas marcas, salvo quando houver autorização formal comprovada.
          </p>

          <h2>4. Limitação de responsabilidade</h2>
          <p>
            A Abastec não se responsabiliza por informações incorretas fornecidas pelo usuário no
            formulário. O usuário é responsável pela veracidade dos dados preenchidos.
          </p>

          <h2>5. Contato</h2>
          <p>
            Dúvidas:{" "}
            <a href="mailto:contato@abastec.com.br">contato@abastec.com.br</a>
          </p>
        </div>
      </div>
    </main>
  );
}
