import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FighterPicker from "@/components/admin/FighterPicker";
import { apiRequest } from "@/lib/queryClient";
import type { Event, Matchup, Fighter } from "@shared/types";

interface MatchupDraft {
  id?: string;
  redCornerId: string | null;
  blueCornerId: string | null;
  redCorner: Fighter | null;
  blueCorner: Fighter | null;
  weightLbs: number;
  rounds: number;
  cardSection: string;
  sortOrder: number;
  label: string;
  isNew?: boolean;
}

const sectionLabels: Record<string, string> = {
  main: "Main Card",
  prelim: "Preliminares",
  undercard: "Undercard",
};

export default function CardBuilder() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [matchups, setMatchups] = useState<MatchupDraft[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ index: number; corner: "red" | "blue" } | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: event } = useQuery<Event>({
    queryKey: [`/api/events/${params.id}/detail`],
    queryFn: async () => {
      const events = await (await fetch("/api/events", { credentials: "include" })).json();
      return events.find((e: Event) => e.id === params.id);
    },
  });

  const { data: serverMatchups } = useQuery<Matchup[]>({
    queryKey: [`/api/events/${params.id}/matchups`],
  });

  const { data: allFighters } = useQuery<Fighter[]>({
    queryKey: ["/api/fighters"],
  });

  // Initialize matchups from server data
  useEffect(() => {
    if (serverMatchups && allFighters) {
      const fighterMap = new Map(allFighters.map((f) => [f.id, f]));
      const drafts: MatchupDraft[] = serverMatchups.map((m) => ({
        id: m.id,
        redCornerId: m.redCornerId,
        blueCornerId: m.blueCornerId,
        redCorner: m.redCornerId ? fighterMap.get(m.redCornerId) || null : null,
        blueCorner: m.blueCornerId ? fighterMap.get(m.blueCornerId) || null : null,
        weightLbs: m.weightLbs || 0,
        rounds: m.rounds || 0,
        cardSection: m.cardSection,
        sortOrder: m.sortOrder,
        label: m.label || "",
      }));
      setMatchups(drafts.sort((a, b) => a.sortOrder - b.sortOrder));
    }
  }, [serverMatchups, allFighters]);

  const openPicker = (index: number, corner: "red" | "blue") => {
    setPickerTarget({ index, corner });
    setPickerOpen(true);
  };

  const handleFighterSelect = (fighter: Fighter) => {
    if (!pickerTarget) return;
    setMatchups((prev) => {
      const updated = [...prev];
      const m = { ...updated[pickerTarget.index] };
      if (pickerTarget.corner === "red") {
        m.redCornerId = fighter.id;
        m.redCorner = fighter;
      } else {
        m.blueCornerId = fighter.id;
        m.blueCorner = fighter;
      }
      updated[pickerTarget.index] = m;
      return updated;
    });
  };

  const addMatchup = (section: string) => {
    const sectionMatchups = matchups.filter((m) => m.cardSection === section);
    const maxOrder = matchups.length > 0 ? Math.max(...matchups.map((m) => m.sortOrder)) : 0;
    setMatchups([
      ...matchups,
      {
        redCornerId: null,
        blueCornerId: null,
        redCorner: null,
        blueCorner: null,
        weightLbs: 0,
        rounds: 4,
        cardSection: section,
        sortOrder: maxOrder + 1,
        label: "",
        isNew: true,
      },
    ]);
  };

  const removeMatchup = (index: number) => {
    setMatchups((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMatchup = (index: number, field: keyof MatchupDraft, value: any) => {
    setMatchups((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const moveMatchup = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= matchups.length) return;
    setMatchups((prev) => {
      const updated = [...prev];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated.map((m, i) => ({ ...m, sortOrder: i + 1 }));
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      // Delete matchups that were on server but are now removed
      const serverIdList = (serverMatchups || []).map((m) => m.id);
      const currentIds = new Set(matchups.filter((m) => m.id).map((m) => m.id));
      for (let si = 0; si < serverIdList.length; si++) {
        const id = serverIdList[si];
        if (!currentIds.has(id)) {
          await apiRequest("DELETE", `/api/matchups/${id}`);
        }
      }

      // Create/update matchups
      for (let i = 0; i < matchups.length; i++) {
        const m = matchups[i];
        const payload = {
          eventId: params.id,
          redCornerId: m.redCornerId,
          blueCornerId: m.blueCornerId,
          weightLbs: m.weightLbs,
          rounds: m.rounds,
          cardSection: m.cardSection,
          sortOrder: i + 1,
          label: m.label || null,
        };

        if (m.id && !m.isNew) {
          await apiRequest("PUT", `/api/matchups/${m.id}`, payload);
        } else {
          await apiRequest("POST", `/api/events/${params.id}/matchups`, payload);
        }
      }

      queryClient.invalidateQueries({ queryKey: [`/api/events/${params.id}/matchups`] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/featured-event"] });
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const sections = ["main", "prelim", "undercard"];

  return (
    <div>
      <Link href="/admin/eventos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white text-sm font-semibold uppercase tracking-wider mb-6">
        <ArrowLeft className="w-4 h-4" /> Eventos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-tight">Cartelera</h1>
          {event && <p className="text-muted-foreground text-sm mt-1">{event.title}</p>}
        </div>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90 px-8">
          {saving ? "Guardando..." : "Guardar Cartelera"}
        </Button>
      </div>

      <div className="space-y-8">
        {sections.map((section) => {
          const sectionMatchups = matchups
            .map((m, originalIndex) => ({ ...m, originalIndex }))
            .filter((m) => m.cardSection === section);

          return (
            <div key={section}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-primary" />
                <h2 className="font-display text-xl text-white uppercase tracking-widest">
                  {sectionLabels[section]}
                </h2>
                <span className="text-xs text-muted-foreground">({sectionMatchups.length} peleas)</span>
              </div>

              <div className="space-y-2">
                {sectionMatchups.map((m) => (
                  <div key={m.originalIndex} className="flex items-center gap-2 bg-card border border-white/5 p-3">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button type="button" onClick={() => moveMatchup(m.originalIndex, -1)} className="text-muted-foreground hover:text-white text-xs">▲</button>
                      <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                      <button type="button" onClick={() => moveMatchup(m.originalIndex, 1)} className="text-muted-foreground hover:text-white text-xs">▼</button>
                    </div>

                    {/* Red Corner */}
                    <button
                      type="button"
                      onClick={() => openPicker(m.originalIndex, "red")}
                      className="flex-1 bg-background border border-white/10 hover:border-primary/30 p-2 text-left transition-colors min-w-0"
                    >
                      {m.redCorner ? (
                        <span className="text-white text-sm font-medium truncate block">
                          {m.redCorner.firstName} {m.redCorner.lastName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Esquina Roja...</span>
                      )}
                    </button>

                    <span className="text-primary font-display text-sm shrink-0">VS</span>

                    {/* Blue Corner */}
                    <button
                      type="button"
                      onClick={() => openPicker(m.originalIndex, "blue")}
                      className="flex-1 bg-background border border-white/10 hover:border-primary/30 p-2 text-left transition-colors min-w-0"
                    >
                      {m.blueCorner ? (
                        <span className="text-white text-sm font-medium truncate block">
                          {m.blueCorner.firstName} {m.blueCorner.lastName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Esquina Azul...</span>
                      )}
                    </button>

                    {/* Weight */}
                    <Input
                      type="number"
                      value={m.weightLbs || ""}
                      onChange={(e) => updateMatchup(m.originalIndex, "weightLbs", parseInt(e.target.value) || 0)}
                      className="w-20 bg-background border-white/10 text-center shrink-0"
                      placeholder="LBS"
                    />

                    {/* Rounds */}
                    <Input
                      type="number"
                      value={m.rounds || ""}
                      onChange={(e) => updateMatchup(m.originalIndex, "rounds", parseInt(e.target.value) || 0)}
                      className="w-16 bg-background border-white/10 text-center shrink-0"
                      placeholder="R"
                    />

                    {/* Label */}
                    <Input
                      value={m.label}
                      onChange={(e) => updateMatchup(m.originalIndex, "label", e.target.value)}
                      className="w-32 bg-background border-white/10 shrink-0 hidden lg:block"
                      placeholder="Etiqueta"
                    />

                    {/* Section */}
                    <select
                      value={m.cardSection}
                      onChange={(e) => updateMatchup(m.originalIndex, "cardSection", e.target.value)}
                      className="bg-background border border-white/10 px-2 py-1.5 text-xs text-white shrink-0 hidden md:block"
                    >
                      {sections.map((s) => (
                        <option key={s} value={s}>{sectionLabels[s]}</option>
                      ))}
                    </select>

                    {/* Delete */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeMatchup(m.originalIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 border-white/10 text-muted-foreground hover:text-white gap-2"
                onClick={() => addMatchup(section)}
              >
                <Plus className="w-3 h-3" /> Agregar Pelea
              </Button>
            </div>
          );
        })}
      </div>

      <FighterPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleFighterSelect}
        excludeIds={matchups.flatMap((m) => [m.redCornerId, m.blueCornerId].filter(Boolean) as string[])}
      />
    </div>
  );
}
