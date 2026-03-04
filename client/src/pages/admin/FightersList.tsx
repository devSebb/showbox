import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Fighter } from "@shared/types";

export default function FightersList() {
  const queryClient = useQueryClient();
  const { data: fighters, isLoading } = useQuery<Fighter[]>({ queryKey: ["/api/fighters"] });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/fighters/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/fighters"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-tight">Peleadores</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona los peleadores del roster</p>
        </div>
        <Link href="/admin/peleadores/nuevo">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Nuevo
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : (
        <div className="border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-card">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">División</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Récord</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fighters?.map((fighter) => (
                <tr key={fighter.id} className="border-b border-white/5 hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {fighter.photoUrl ? (
                        <img src={fighter.photoUrl} alt="" className="w-8 h-8 object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-white/5 flex items-center justify-center text-xs text-muted-foreground font-bold">
                          {fighter.firstName.charAt(0)}{fighter.lastName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm flex items-center gap-2">
                          {fighter.firstName} {fighter.lastName}
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none ${
                            fighter.isAmateur
                              ? "bg-amber-900/20 text-amber-400 border border-amber-500/30"
                              : "bg-blue-900/20 text-blue-400 border border-blue-500/30"
                          }`}>
                            {fighter.isAmateur ? "Amateur" : "Pro"}
                          </span>
                        </p>
                        {fighter.nickname && (
                          <p className="text-xs text-muted-foreground italic">"{fighter.nickname}"</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell capitalize">
                    {fighter.weightClass || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-white hidden sm:table-cell">
                    {fighter.wins}-{fighter.losses}-{fighter.draws}
                    {fighter.kos > 0 && <span className="text-primary ml-1">({fighter.kos} KO)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold uppercase ${
                      fighter.isActive
                        ? "bg-green-900/20 text-green-400 border border-green-500/30"
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}>
                      {fighter.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/peleadores/${fighter.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      {fighter.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deactivateMutation.mutate(fighter.id)}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
