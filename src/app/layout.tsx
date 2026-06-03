import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistência Técnica para Eletrodomésticos Nacionais em São Paulo | Abastec",
  description:
    "Solicite atendimento técnico para geladeiras, lavadoras, lava e seca, fogões, fornos, cooktops e micro-ondas das marcas Brastemp, Electrolux, Consul, LG, Samsung e General Electric em São Paulo.",
  robots: "index, follow",
  openGraph: {
    title: "Assistência Técnica para Eletrodomésticos Nacionais | Abastec",
    description:
      "Atendimento técnico especializado para eletrodomésticos de linha branca em São Paulo. Agende agora.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a4fb0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
