import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import type { Setting } from "@shared/types";

interface SettingsFormValues {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  contactEmail: string;
  contactPhone: string;
  aboutText: string;
}

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  const { register, handleSubmit, reset } = useForm<SettingsFormValues>({
    defaultValues: {
      instagram: "",
      facebook: "",
      youtube: "",
      tiktok: "",
      contactEmail: "",
      contactPhone: "",
      aboutText: "",
    },
  });

  useEffect(() => {
    if (settings) {
      const map = new Map(settings.map((s) => [s.key, s.value]));
      reset({
        instagram: map.get("instagram") || "",
        facebook: map.get("facebook") || "",
        youtube: map.get("youtube") || "",
        tiktok: map.get("tiktok") || "",
        contactEmail: map.get("contactEmail") || "",
        contactPhone: map.get("contactPhone") || "",
        aboutText: map.get("aboutText") || "",
      });
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      await apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/settings"] });
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white uppercase tracking-tight">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Redes sociales y datos de contacto</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-3xl space-y-8">
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Redes Sociales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input {...register("instagram")} className="bg-card border-white/10" placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input {...register("facebook")} className="bg-card border-white/10" placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input {...register("youtube")} className="bg-card border-white/10" placeholder="https://youtube.com/..." />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input {...register("tiktok")} className="bg-card border-white/10" placeholder="https://tiktok.com/..." />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Contacto</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register("contactEmail")} className="bg-card border-white/10" placeholder="info@showbox.ec" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input {...register("contactPhone")} className="bg-card border-white/10" placeholder="+593 99 123 4567" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Acerca De</legend>
          <Textarea {...register("aboutText")} className="bg-card border-white/10 min-h-[120px]" placeholder="Texto para la sección Acerca De..." />
        </fieldset>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 px-8">
            {mutation.isPending ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>

        {mutation.isSuccess && (
          <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 text-sm">
            Configuración guardada correctamente.
          </div>
        )}

        {mutation.error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
            Error al guardar. Intenta de nuevo.
          </div>
        )}
      </form>
    </div>
  );
}
