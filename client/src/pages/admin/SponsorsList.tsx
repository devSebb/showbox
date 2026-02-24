import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Sponsor } from "@shared/types";

const tierLabels: Record<string, string> = {
  title: "Title",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};

const tierColors: Record<string, string> = {
  title: "bg-primary/20 text-primary border-primary/40",
  gold: "bg-yellow-900/20 text-yellow-400 border-yellow-500/30",
  silver: "bg-gray-500/20 text-gray-300 border-gray-400/30",
  bronze: "bg-orange-900/20 text-orange-400 border-orange-500/30",
};

export default function SponsorsList() {
  const queryClient = useQueryClient();
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({ queryKey: ["/api/sponsors"] });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/sponsors/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/sponsors"] }),
  });

  const sorted = [...(sponsors || [])].sort((a, b) => {
    const tierOrder = { title: 0, gold: 1, silver: 2, bronze: 3 };
    const ta = tierOrder[a.tier as keyof typeof tierOrder] ?? 4;
    const tb = tierOrder[b.tier as keyof typeof tierOrder] ?? 4;
    if (ta !== tb) return ta - tb;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-tight">Auspiciantes</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona sponsors y auspiciantes</p>
        </div>
        <Link href="/admin/auspiciantes/nuevo">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Nuevo
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {sorted.map((sponsor) => (
            <div key={sponsor.id} className="flex items-center gap-4 bg-card border border-white/5 hover:border-white/10 p-4 transition-colors">
              <div className="w-12 h-12 bg-white/5 shrink-0 overflow-hidden flex items-center justify-center">
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground font-bold">{sponsor.name.charAt(0)}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{sponsor.name}</p>
                {sponsor.tagline && (
                  <p className="text-xs text-muted-foreground truncate">{sponsor.tagline}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 text-xs font-semibold uppercase border ${tierColors[sponsor.tier] || tierColors.bronze}`}>
                  {tierLabels[sponsor.tier] || sponsor.tier}
                </span>
                {!sponsor.isActive && (
                  <span className="px-2 py-0.5 text-xs font-semibold uppercase bg-white/10 text-white/40 border border-white/20">
                    Inactivo
                  </span>
                )}
              </div>

              {sponsor.brandColor && (
                <div
                  className="w-4 h-4 border border-white/20 shrink-0"
                  style={{ backgroundColor: sponsor.brandColor }}
                  title={sponsor.brandColor}
                />
              )}

              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/auspiciantes/${sponsor.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-white" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost" size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    if (confirm("¿Estás seguro de eliminar este auspiciante?")) {
                      deleteMutation.mutate(sponsor.id);
                    }
                  }}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No hay auspiciantes registrados</div>
          )}
        </div>
      )}
    </div>
  );
}
