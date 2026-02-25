import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Calendar, MapPin, Clock, ArrowLeft, Ticket } from "lucide-react";
import { gsap } from "@/lib/gsap";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FightCard from "@/components/sections/FightCard";
import Sponsors from "@/components/sections/Sponsors";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { effectiveTicketUrl } from "@/lib/utils";
import type { EventWithMatchups } from "@shared/types";

export default function EventDetail() {
  const params = useParams<{ slug: string }>();
  const heroRef = useRef<HTMLElement>(null);

  const { data: event, isLoading, error } = useQuery<EventWithMatchups>({
    queryKey: [`/api/public/events/${params.slug}`],
  });

  useEffect(() => {
    if (!heroRef.current || !event) return;
    const ctx = gsap.context(() => {
      gsap.from(".detail-hero-content", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".detail-info-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });
    }, heroRef.current);
    return () => ctx.revert();
  }, [event]);

  if (isLoading) return <LoadingSpinner />;

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <div className="pt-32 pb-24 text-center">
          <h1 className="font-display text-5xl text-white mb-4">Evento No Encontrado</h1>
          <p className="text-muted-foreground mb-8">El evento que buscas no existe o no está disponible.</p>
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-semibold uppercase tracking-wider text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Ver Todos los Eventos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);
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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar ticketUrl={event.ticketUrl} ticketCtaText={event.ticketCtaText} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-24 pb-16 overflow-hidden">
        {/* Background */}
        {(event.posterUrl || event.heroImageUrl) && (
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity scale-110"
              style={{ backgroundImage: `url(${event.heroImageUrl || event.posterUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          {/* Back link */}
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Eventos
          </Link>

          <div className="detail-hero-content flex flex-col lg:flex-row gap-12 items-start">
            {/* Poster */}
            {event.posterUrl && (
              <div className="w-full lg:w-1/3 max-w-sm">
                <div className="aspect-[3/4] overflow-hidden border border-white/10">
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Event Info */}
            <div className="flex-1">
              {event.subtitle && (
                <p className="text-accent font-semibold uppercase tracking-[0.2em] text-sm mb-3">
                  {event.subtitle}
                </p>
              )}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight mb-6">
                {event.title}
              </h1>

              {event.description && (
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                  {event.description}
                </p>
              )}

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="detail-info-card bg-card border border-white/5 p-5 flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Fecha</p>
                    <p className="text-white text-sm font-medium">{capitalizedDate}</p>
                  </div>
                </div>
                <div className="detail-info-card bg-card border border-white/5 p-5 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Hora</p>
                    <p className="text-white text-sm font-medium">{timeStr}</p>
                  </div>
                </div>
                {event.venue && (
                  <div className="detail-info-card bg-card border border-white/5 p-5 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Lugar</p>
                      <p className="text-white text-sm font-medium">{event.venue}{event.city ? `, ${event.city}` : ""}</p>
                    </div>
                  </div>
                )}
                {event.ticketUrl && (
                  <div className="detail-info-card bg-card border border-white/5 p-5 flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Boletos</p>
                      <a href={effectiveTicketUrl(event.ticketUrl)} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium hover:underline">
                        Comprar Ahora
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              {event.ticketUrl && (
                <a
                  href={effectiveTicketUrl(event.ticketUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase tracking-widest px-10 py-4 transition-all hover:box-glow hover:-translate-y-1"
                >
                  {event.ticketCtaText || "Comprar Boletos"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fight Card */}
      {event.matchups.length > 0 && (
        <FightCard matchups={event.matchups} ticketUrl={event.ticketUrl} />
      )}

      {/* Sponsors */}
      {event.sponsors.length > 0 && (
        <Sponsors sponsors={event.sponsors} />
      )}

      {/* Map */}
      {event.mapEmbedUrl && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight text-center mb-8">
              Ubicación
            </h2>
            <div className="max-w-4xl mx-auto aspect-video relative overflow-hidden border border-white/10">
              <iframe
                src={event.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      <Footer ticketUrl={event.ticketUrl} />
    </div>
  );
}
