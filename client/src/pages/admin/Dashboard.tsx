import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Users, Calendar, Award, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/admin/StatCard";
import type { Fighter, Event, Sponsor } from "@shared/types";

export default function Dashboard() {
  const { data: fighters } = useQuery<Fighter[]>({ queryKey: ["/api/fighters"] });
  const { data: events } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const { data: sponsors } = useQuery<Sponsor[]>({ queryKey: ["/api/sponsors"] });

  const activeFighters = fighters?.filter((f) => f.isActive).length ?? 0;
  const totalEvents = events?.length ?? 0;
  const nextEvent = events
    ?.filter((e) => e.status === "published" && new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  const activeSponsors = sponsors?.filter((s) => s.isActive).length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white uppercase tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Panel de administración de Showbox Promotions EC</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Peleadores Activos" value={activeFighters} icon={Users} />
        <StatCard title="Total Eventos" value={totalEvents} icon={Calendar} />
        <StatCard
          title="Próximo Evento"
          value={nextEvent ? new Date(nextEvent.date).toLocaleDateString("es-EC", { day: "numeric", month: "short" }) : "—"}
          icon={Calendar}
          description={nextEvent?.title}
        />
        <StatCard title="Auspiciantes" value={activeSponsors} icon={Award} />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display text-xl text-white uppercase tracking-wider mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/peleadores/nuevo">
            <Button variant="outline" className="border-white/10 hover:border-primary/50 gap-2">
              <Plus className="w-4 h-4" /> Nuevo Peleador
            </Button>
          </Link>
          <Link href="/admin/eventos/nuevo">
            <Button variant="outline" className="border-white/10 hover:border-primary/50 gap-2">
              <Plus className="w-4 h-4" /> Nuevo Evento
            </Button>
          </Link>
          <Link href="/admin/auspiciantes/nuevo">
            <Button variant="outline" className="border-white/10 hover:border-primary/50 gap-2">
              <Plus className="w-4 h-4" /> Nuevo Auspiciante
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Events */}
      {events && events.length > 0 && (
        <div>
          <h2 className="font-display text-xl text-white uppercase tracking-wider mb-4">Eventos Recientes</h2>
          <div className="space-y-2">
            {events.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                href={`/admin/eventos/${event.id}`}
                className="flex items-center justify-between bg-card border border-white/5 hover:border-white/10 p-4 transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {event.venue && ` · ${event.venue}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {event.isFeatured && (
                    <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-accent/20 text-accent border border-accent/40">
                      Destacado
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-semibold uppercase ${
                    event.status === "published"
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-white/10 text-white/60 border border-white/20"
                  }`}>
                    {event.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
