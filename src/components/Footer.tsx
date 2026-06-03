"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-brand-blue">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-lg">Precisa de assistência técnica?</p>
            <p className="text-blue-100 text-sm mt-0.5">Preencha o formulário e siga para o WhatsApp em segundos.</p>
          </div>
          <a
            href="#formulario"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-blue shadow-sm hover:bg-blue-50 transition-colors"
          >
            Solicitar agora
          </a>
        </div>
      </div>

      {/* Footer principal */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Logo + descrição */}
          <div>
            <Image
              src="/logo-abastec.webp"
              alt="Abastec"
              width={150}
              height={40}
              className="h-9 w-auto object-contain brightness-0 invert mb-3"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Assistência técnica especializada para eletrodomésticos de linha branca em São Paulo.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Contato
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:contato@abastec.com.br"
                  className="hover:text-white transition-colors"
                >
                  contato@abastec.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Links legais */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Informações legais
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="hover:text-white transition-colors">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer de marcas */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            As marcas mencionadas pertencem aos seus respectivos fabricantes e são utilizadas
            apenas para identificação dos equipamentos atendidos. A Abastec atua como assistência
            técnica independente, salvo quando houver autorização formal comprovada.
          </p>
          <p className="text-xs text-gray-600">
            © {year} Abastec. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
