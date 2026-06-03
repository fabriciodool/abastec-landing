"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/logo-abastec.webp"
              alt="Abastec – Assistência Técnica"
              width={180}
              height={48}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Centro — texto institucional (desktop) */}
          <p className="hidden md:block text-sm text-gray-500 font-medium">
            Atendimento técnico especializado
          </p>

          {/* CTA */}
          <button
            onClick={scrollToForm}
            className="btn-primary text-sm px-4 py-2.5 sm:px-5 sm:py-3"
          >
            <span className="hidden sm:inline">Solicitar atendimento</span>
            <span className="sm:hidden">Solicitar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
