import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import FightCard from "@/components/sections/FightCard";
import EventInfo from "@/components/sections/EventInfo";
import fightWeekImg from "@assets/fight-week-bg.png";
import About from "@/components/sections/About";
import Sponsors from "@/components/sections/Sponsors";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import type { EventWithMatchups } from "@shared/types";

export default function Home() {
  const { data: event, isLoading: eventLoading } = useQuery<EventWithMatchups>({
    queryKey: ["/api/public/featured-event"],
  });

  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["/api/public/settings"],
  });

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">No hay evento destacado disponible.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar ticketUrl={event.ticketUrl} ticketCtaText={event.ticketCtaText} />

      <main>
        <Hero
          title={event.title}
          subtitle={event.subtitle}
          date={event.date}
          venue={event.venue}
          city={event.city}
          ticketUrl={event.ticketUrl}
          heroImageUrl={event.heroImageUrl}
          sponsors={event.sponsors}
        />
        <section className="w-full" aria-hidden>
          <img
            src={fightWeekImg}
            alt="Fight Week — programa de la semana del evento"
            className="w-full h-auto object-cover object-center block"
          />
        </section>
        <EventInfo
          date={event.date}
          venue={event.venue}
          city={event.city}
          address={event.address}
          mapEmbedUrl={event.mapEmbedUrl}
          ticketUrl={event.ticketUrl}
        />
        <FightCard
          matchups={event.matchups}
          ticketUrl={event.ticketUrl}
        />
        <About aboutText={settings?.aboutText} />
        <Sponsors sponsors={event.sponsors} />
        <Gallery />
        <Contact settings={settings} />
      </main>

      <Footer ticketUrl={event.ticketUrl} />
    </div>
  );
}
