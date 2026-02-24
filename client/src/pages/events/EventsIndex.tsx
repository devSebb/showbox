import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { Event } from "@shared/types";

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    published: { label: "Próximo", cls: "bg-primary/20 text-primary border-primary/40" },
    completed: { label: "Finalizado", cls: "bg-white/10 text-white/60 border-white/20" },
    draft: { label: "Borrador", cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
    cancelled: { label: "Cancelado", cls: "bg-red-900/20 text-red-400 border-red-500/40" },
  };
  const s = map[status] || map.draft;
  return (
    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-widest border ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function EventsIndex() {
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/public/events"],
  });

  useEffect(() => {
    if (!gridRef.current || !events?.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".event-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, gridRef.current);
    return () => ctx.revert();
  }, [events]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero header */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] text-white uppercase tracking-tight mb-4">
            Eventos
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">
            Noches de boxeo profesional en Ecuador
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 -skew-x-12" />
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4" ref={gridRef}>
          {!events || events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No hay eventos publicados aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const dateStr = eventDate.toLocaleDateString("es-EC", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.slug}`}
                    className="event-card group block bg-card border border-white/5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                  >
                    {/* Poster */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      {event.posterUrl ? (
                        <img
                          src={event.posterUrl}
                          alt={event.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-card to-background flex items-center justify-center">
                          <span className="font-display text-4xl text-white/10 uppercase">
                            Showbox
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-4 right-4">
                        {statusBadge(event.status)}
                      </div>

                      {/* Featured star */}
                      {event.isFeatured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-accent/20 text-accent border border-accent/40">
                            Destacado
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="font-display text-xl md:text-2xl text-white uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{dateStr}</span>
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>
                              {event.venue}
                              {event.city ? `, ${event.city}` : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
