import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import logo from "@assets/showbox_logo.png";
import { effectiveTicketUrl } from "@/lib/utils";

interface NavbarProps {
  ticketUrl?: string | null;
  ticketCtaText?: string | null;
}

export default function Navbar({ ticketUrl, ticketCtaText }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On home page: hash links for sections, route links for other pages
  // On other pages: route links everywhere
  const navLinks = isHome
    ? [
        { name: "Inicio", href: "#inicio", isHash: true },
        { name: "Cartelera", href: "#cartelera", isHash: true },
        { name: "Eventos", href: "/eventos", isHash: false },
        { name: "Peleadores", href: "/peleadores", isHash: false },
        { name: "Contacto", href: "#contacto", isHash: true },
      ]
    : [
        { name: "Inicio", href: "/", isHash: false },
        { name: "Eventos", href: "/eventos", isHash: false },
        { name: "Peleadores", href: "/peleadores", isHash: false },
        { name: "Contacto", href: "/#contacto", isHash: true },
      ];

  const ctaText = ticketCtaText || "Comprar Boletos";
  const ctaUrl = effectiveTicketUrl(ticketUrl);

  const renderNavLink = (link: typeof navLinks[0]) => {
    if (link.isHash) {
      return (
        <a
          href={link.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors duration-200"
        >
          {link.name}
        </a>
      );
    }
    return (
      <Link
        href={link.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors duration-200"
      >
        {link.name}
      </Link>
    );
  };

  const renderMobileLink = (link: typeof navLinks[0]) => {
    if (link.isHash) {
      return (
        <a
          href={link.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className="font-display text-4xl uppercase tracking-widest text-white hover:text-primary transition-colors"
        >
          {link.name}
        </a>
      );
    }
    return (
      <Link
        href={link.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className="font-display text-4xl uppercase tracking-widest text-white hover:text-primary transition-colors"
      >
        {link.name}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between w-full">
        <Link href="/" className="relative z-50 flex-shrink-0">
          <img src={logo} alt="Showbox Promotions EC" className="h-8 md:h-10 w-auto" />
        </Link>

        {/* Desktop Nav - centered between logo and CTA */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>{renderNavLink(link)}</li>
            ))}
          </ul>
        </nav>

        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex flex-shrink-0 bg-primary hover:bg-primary/90 text-white font-display text-lg uppercase tracking-widest px-6 py-2 transition-all hover:box-glow hover:-translate-y-0.5"
          data-testid="link-buy-tickets-nav"
        >
          {ctaText}
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-50 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 bg-background z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="flex flex-col items-center gap-8 mb-12">
            {navLinks.map((link) => (
              <li key={link.name}>{renderMobileLink(link)}</li>
            ))}
          </ul>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white font-display text-2xl uppercase tracking-widest px-10 py-4 box-glow"
            data-testid="link-buy-tickets-mobile"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
