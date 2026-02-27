import { useRef, useEffect, useState } from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { gsap } from "@/lib/gsap";

interface ContactProps {
  settings?: Record<string, string>;
}

export default function Contact({ settings }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          aria-hidden
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      url: "https://www.tiktok.com/@showboxec",
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
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus("sending");
              setErrorMessage("");
              try {
                const res = await fetch("/api/public/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, message }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  setStatus("error");
                  setErrorMessage(data.message || "Error al enviar. Intenta de nuevo.");
                  return;
                }
                setStatus("success");
                setName("");
                setEmail("");
                setMessage("");
              } catch {
                setStatus("error");
                setErrorMessage("Error de conexión. Intenta de nuevo.");
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-input/50 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input/50 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Mensaje
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-input/50 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="¿En qué podemos ayudarte?"
                required
              />
            </div>

            {status === "success" && (
              <p className="text-sm text-green-400 font-medium">Mensaje enviado correctamente.</p>
            )}
            {status === "error" && errorMessage && (
              <p className="text-sm text-red-400 font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase tracking-widest py-4 transition-all hover:box-glow mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="button-submit-contact"
            >
              {status === "sending" ? "Enviando…" : "Enviar Mensaje"}
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
