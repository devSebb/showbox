import { Link } from "wouter";
import logo from "@assets/showbox_logo.png";

interface FooterProps {
  ticketUrl?: string | null;
}

export default function Footer({ ticketUrl }: FooterProps) {
  const ctaUrl = ticketUrl || "https://www.buenplan.com.ec/event/quorum-figth-xiii-2025-quito";

  const hashLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Cartelera", href: "#cartelera" },
  ];

  const routeLinks = [
    { name: "Eventos", href: "/eventos" },
    { name: "Peleadores", href: "/peleadores" },
  ];

  return (
    <footer className="bg-[#0A0A0A] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <Link href="/">
          <img src={logo} alt="Showbox Promotions EC" className="h-16 mb-8 opacity-80" />
        </Link>

        <ul className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {hashLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
              >
                {link.name}
              </a>
            </li>
          ))}
          {routeLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#contacto"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
            >
              Contacto
            </a>
          </li>
        </ul>

        <div className="w-full max-w-lg border-t border-white/10 my-8" />

        <div className="flex flex-col items-center text-center space-y-4">
          <p className="text-sm font-medium text-white/50">
            Boletos disponibles en{" "}
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              buenplan.com.ec
            </a>
          </p>
          <p className="text-xs text-white/30 tracking-wider">
            © 2026 Showbox Promotions EC — Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
