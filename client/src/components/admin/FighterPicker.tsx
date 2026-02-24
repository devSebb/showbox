import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Fighter } from "@shared/types";

interface FighterPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (fighter: Fighter) => void;
  excludeIds?: string[];
}

export default function FighterPicker({ open, onClose, onSelect, excludeIds = [] }: FighterPickerProps) {
  const [search, setSearch] = useState("");
  const { data: fighters } = useQuery<Fighter[]>({ queryKey: ["/api/fighters"] });

  const filtered = (fighters || [])
    .filter((f) => f.isActive && !excludeIds.includes(f.id))
    .filter((f) =>
      !search || `${f.firstName} ${f.lastName} ${f.nickname || ""}`.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-white/10 max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white uppercase tracking-wider">
            Seleccionar Peleador
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="bg-background border-white/10 pl-10"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {filtered.map((fighter) => (
            <button
              key={fighter.id}
              type="button"
              onClick={() => { onSelect(fighter); onClose(); }}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
            >
              {fighter.photoUrl ? (
                <img src={fighter.photoUrl} alt="" className="w-10 h-10 object-cover" />
              ) : (
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-xs text-muted-foreground font-bold shrink-0">
                  {fighter.firstName.charAt(0)}{fighter.lastName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {fighter.firstName} {fighter.lastName}
                  {fighter.nickname && <span className="text-muted-foreground italic ml-1">"{fighter.nickname}"</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fighter.weightClass || "Sin división"} · {fighter.wins}-{fighter.losses}-{fighter.draws}
                </p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-8 text-muted-foreground text-sm">No se encontraron peleadores</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
