import { useRef, useEffect } from "react";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import { gsap } from "@/lib/gsap";

interface EventInfoProps {
  date: string | Date;
  venue: string | null;
  city: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  ticketUrl: string | null;
}

export default function EventInfo({ date, venue, city, mapEmbedUrl, ticketUrl }: EventInfoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eventDate = new Date(date);

  const dateStr = eventDate.toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const timeStr = eventDate.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".info-card", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      gsap.from(".info-map", {
        x: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  const infoItems = [
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Fecha",
      detail: capitalizedDate,
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Ubicación",
      detail: `${venue || "TBD"}${city ? `, ${city}` : ""}`,
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Hora de Inicio",
      detail: timeStr,
    },
    {
      icon: <Ticket className="w-8 h-8 text-primary" />,
      title: "Boletos",
      detail: "Disponibles en BuenPlan",
      link: ticketUrl || undefined,
    },
  ];

  return (
    <section id="evento" ref={sectionRef} className="py-24 bg-card relative clip-slash-top clip-slash-bottom -mt-16 -mb-16 z-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

          {/* Info Cards */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoItems.map((item) => (
              <div
                key={item.title}
                className="info-card bg-background border border-white/5 p-8 flex flex-col items-start hover:border-primary/50 transition-colors group"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="font-display text-xl text-white uppercase tracking-wider mb-2">
                  {item.title}
                </h4>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    {item.detail}
                  </a>
                ) : (
                  <p className="text-muted-foreground font-medium">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Map */}
          {mapEmbedUrl && (
            <div className="info-map w-full lg:w-1/2 aspect-video lg:aspect-square relative group overflow-hidden">
              <div className="absolute inset-0 bg-background/50 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute inset-0 border border-white/10 z-20 pointer-events-none" />
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/20 blur-3xl z-0" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
