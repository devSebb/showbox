import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Star, Trash2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/types";

export default function EventsList() {
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useQuery<Event[]>({ queryKey: ["/api/events"] });

  const featureMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PUT", `/api/events/${id}/feature`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/events"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/events"] }),
  });

  const statusColors: Record<string, string> = {
    published: "bg-primary/20 text-primary border-primary/40",
    draft: "bg-yellow-900/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-white/10 text-white/60 border-white/20",
    cancelled: "bg-red-900/20 text-red-400 border-red-500/30",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-tight">Eventos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona eventos y carteleras</p>
        </div>
        <Link href="/admin/eventos/nuevo">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Nuevo
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {events?.map((event) => (
            <div key={event.id} className="flex items-center gap-4 bg-card border border-white/5 hover:border-white/10 p-4 transition-colors">
              {/* Poster thumb */}
              <div className="w-12 h-16 bg-white/5 shrink-0 overflow-hidden">
                {event.posterUrl ? (
                  <img src={event.posterUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">—</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" })}
                  {event.venue && ` · ${event.venue}`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {event.isFeatured && (
                  <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-accent/20 text-accent border border-accent/40">
                    Destacado
                  </span>
                )}
                <span className={`px-2 py-0.5 text-xs font-semibold uppercase border ${statusColors[event.status] || statusColors.draft}`}>
                  {event.status}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost" size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-accent"
                  onClick={() => featureMutation.mutate(event.id)}
                  title="Destacar"
                >
                  <Star className={`w-4 h-4 ${event.isFeatured ? "fill-accent text-accent" : ""}`} />
                </Button>
                <Link href={`/admin/eventos/${event.id}/cartelera`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-white" title="Cartelera">
                    <ListChecks className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/admin/eventos/${event.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-white" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost" size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    if (confirm("¿Estás seguro de eliminar este evento?")) {
                      deleteMutation.mutate(event.id);
                    }
                  }}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
