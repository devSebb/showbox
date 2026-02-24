import { useRef, useEffect } from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { gsap } from "@/lib/gsap";

interface ContactProps {
  settings?: Record<string, string>;
}

export default function Contact({ settings }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-heading", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      gsap.from(".contact-form", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  const socialLinks = [
    {
      key: "instagram",
      icon: <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />,
      url: "https://www.instagram.com/showboxec/",
    },
    {
      key: "facebook",
      icon: <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />,
      url: settings?.facebook,
    },
    {
      key: "youtube",
      icon: <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />,
      url: settings?.youtube,
    },
    {
      key: "tiktok",
      icon: (
        <span className="font-display text-lg italic leading-none group-hover:scale-110 transition-transform">
          d
        </span>
      ),
      url: settings?.tiktok,
    },
  ];

  return (
    <section id="contacto" ref={sectionRef} className="py-24 bg-card relative clip-slash-top z-10 mt-[-5vw]">
      <div className="container mx-auto px-4">
        <div className="contact-heading max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tight mb-4">
            ¿Quieres Ser Parte <span className="text-primary">Del Ring?</span>
          </h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest">
            Contáctanos para pelear, auspiciar o colaborar
          </p>
        </div>

        <div className="contact-form max-w-2xl mx-auto bg-background border border-white/10 p-8 md:p-12">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full bg-input/50 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-input/50 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Mensaje
              </label>
              <textarea
                rows={4}
                className="w-full bg-input/50 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase tracking-widest py-4 transition-all hover:box-glow mt-4"
              data-testid="button-submit-contact"
            >
              Enviar Mensaje
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-white/10 flex flex-col items-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Síguenos en Redes Sociales
            </p>
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url || "#"}
                  target={link.url ? "_blank" : undefined}
                  rel={link.url ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all group"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
