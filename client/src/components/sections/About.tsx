import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import logo from "@assets/showbox_logo.png";

interface AboutProps {
  aboutText?: string;
}

export default function About({ aboutText }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-title", {
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
      gsap.from(".about-text", {
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      gsap.from(".about-stat", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "XIII", label: "Eventos Realizados" },
    { value: "50+", label: "Peleas Profesionales" },
    { value: "1000+", label: "Asistentes por Evento" },
  ];

  const displayText =
    aboutText ||
    "Somos la promotora de boxeo profesional líder en Ecuador. Desde nuestros inicios, hemos llevado el deporte de combate al más alto nivel, organizando eventos de clase mundial que combinan talento local con estándares internacionales. Showbox Promotions EC es sinónimo de adrenalina, espectáculo y boxeo de élite.";

  return (
    <section id="nosotros" ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-[0.03] pointer-events-none z-0 flex justify-center">
        <img src={logo} alt="" className="w-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="about-title font-display text-5xl md:text-7xl text-white uppercase tracking-tight mb-8">
            Showbox <span className="text-primary">Promotions EC</span>
          </h2>

          <p className="about-text text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed mb-20">
            {displayText.split("Showbox Promotions EC").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span className="text-white">Showbox Promotions EC</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>

          <div className="about-stats grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-white/10 py-16">
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat flex flex-col items-center">
                <span className="font-display text-6xl md:text-7xl text-white mb-2 text-glow">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
