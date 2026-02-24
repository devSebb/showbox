import logo from "@assets/image_1771898956125.png";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <img src={logo} alt="Showbox Promotions EC" className="h-16 mb-8 opacity-80" />
        
        <ul className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {["Inicio", "Evento", "Cartelera", "Boletos", "Contacto"].map((link) => (
            <li key={link}>
              <a 
                href={`#${link.toLowerCase()}`} 
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="w-full max-w-lg border-t border-white/10 my-8" />

        <div className="flex flex-col items-center text-center space-y-4">
          <p className="text-sm font-medium text-white/50">
            Boletos disponibles en <a href="https://buenplan.com.ec" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">buenplan.com.ec</a>
          </p>
          <p className="text-xs text-white/30 tracking-wider">
            © 2026 Showbox Promotions EC — Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}