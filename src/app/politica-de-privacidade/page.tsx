import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | Abastec",
  robots: "noindex",
};

export default function PoliticaDePrivacidade() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="text-sm text-brand-blue hover:underline mb-8 inline-block">
          ← Voltar à página principal
        </Link>

        <div className="bg-white rounded-xl shadow-card p-8 sm:p-10 prose prose-gray max-w-none">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-sm text-gray-500 mb-6">Última atualização: junho de 2025</p>

          <h2>1. Informações coletadas</h2>
          <p>
            Coletamos apenas as informações fornecidas voluntariamente pelo usuário no formulário
            de solicitação de atendimento: marca do equipamento, produto, nome, número de WhatsApp
            e CEP de atendimento.
          </p>
          <p>
            Também coletamos automaticamente, para fins de rastreamento de campanha, parâmetros
            de URL (UTM) e o identificador de clique do Google Ads (GCLID/GBRAID/WBRAID), além
            do referrer e URL da página.
          </p>

          <h2>2. Uso das informações</h2>
          <p>As informações coletadas são utilizadas exclusivamente para:</p>
          <ul>
            <li>Processar e responder à solicitação de atendimento técnico;</li>
            <li>Enviar os dados da solicitação para o WhatsApp da equipe de atendimento;</li>
            <li>Registrar o lead para fins de controle interno e qualidade;</li>
            <li>Mensurar a eficácia de campanhas de marketing (dados agregados e anônimos).</li>
          </ul>

          <h2>3. Compartilhamento de dados</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins
            comerciais. Os dados podem ser processados por ferramentas de infraestrutura (SMTP,
            hospedagem) exclusivamente para viabilizar o serviço.
          </p>

          <h2>4. Armazenamento</h2>
          <p>
            Não armazenamos dados pessoais em localStorage, cookies ou banco de dados público.
            Os dados transitam de forma segura entre o formulário e a equipe de atendimento.
          </p>

          <h2>5. Seus direitos (LGPD)</h2>
          <p>
            Nos termos da Lei nº 13.709/2018 (LGPD), você tem direito a acessar, corrigir ou
            solicitar a exclusão de seus dados pessoais. Para exercer esses direitos, entre em
            contato pelo e-mail{" "}
            <a href="mailto:contato@abastec.com.br">contato@abastec.com.br</a>.
          </p>

          <h2>6. Contato</h2>
          <p>
            Dúvidas sobre esta política:{" "}
            <a href="mailto:contato@abastec.com.br">contato@abastec.com.br</a>
          </p>
        </div>
      </div>
    </main>
  );
}
