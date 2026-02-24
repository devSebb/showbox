import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/admin/ImageUploader";
import { apiRequest } from "@/lib/queryClient";
import type { Sponsor } from "@shared/types";

const sponsorFormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  logoUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  tier: z.string().default("silver"),
  brandColor: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

type SponsorFormValues = z.infer<typeof sponsorFormSchema>;

export default function SponsorForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isEdit = !!params.id;

  const { data: sponsor } = useQuery<Sponsor>({
    queryKey: [`/api/sponsors/${params.id}`],
    enabled: isEdit,
    queryFn: async () => {
      const sponsors = await (await fetch("/api/sponsors", { credentials: "include" })).json();
      return sponsors.find((s: Sponsor) => s.id === params.id);
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: "",
      tier: "silver",
      isActive: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (sponsor) {
      reset({
        name: sponsor.name,
        logoUrl: sponsor.logoUrl,
        websiteUrl: sponsor.websiteUrl,
        tier: sponsor.tier,
        brandColor: sponsor.brandColor,
        tagline: sponsor.tagline,
        isActive: sponsor.isActive,
        sortOrder: sponsor.sortOrder,
      });
    }
  }, [sponsor, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SponsorFormValues) => {
      if (isEdit) {
        await apiRequest("PUT", `/api/sponsors/${params.id}`, data);
      } else {
        await apiRequest("POST", "/api/sponsors", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sponsors"] });
      setLocation("/admin/auspiciantes");
    },
  });

  const logoUrl = watch("logoUrl");
  const brandColor = watch("brandColor");

  return (
    <div>
      <Link href="/admin/auspiciantes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white text-sm font-semibold uppercase tracking-wider mb-6">
        <ArrowLeft className="w-4 h-4" /> Auspiciantes
      </Link>

      <h1 className="font-display text-3xl text-white uppercase tracking-tight mb-8">
        {isEdit ? "Editar Auspiciante" : "Nuevo Auspiciante"}
      </h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-3xl space-y-8">
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Información</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nombre *</Label>
              <Input {...register("name")} className="bg-card border-white/10" placeholder="Forbet" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tier</Label>
              <select {...register("tier")} className="w-full bg-card border border-white/10 px-3 py-2 text-sm text-white">
                <option value="title">Title</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" {...register("sortOrder")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Sitio Web</Label>
              <Input {...register("websiteUrl")} className="bg-card border-white/10" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input {...register("tagline")} className="bg-card border-white/10" placeholder="Pronostica y Gana" />
            </div>
            <div className="space-y-2">
              <Label>Color de Marca</Label>
              <div className="flex items-center gap-2">
                <Input {...register("brandColor")} className="bg-card border-white/10 flex-1" placeholder="#00FF00" />
                {brandColor && (
                  <div
                    className="w-10 h-10 border border-white/20 shrink-0"
                    style={{ backgroundColor: brandColor }}
                  />
                )}
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Logo</legend>
          <ImageUploader value={logoUrl} onChange={(url) => setValue("logoUrl", url)} category="sponsor" />
        </fieldset>

        <div className="flex items-center gap-3">
          <Switch
            checked={watch("isActive")}
            onCheckedChange={(v) => setValue("isActive", v)}
          />
          <Label>Activo</Label>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 px-8">
            {mutation.isPending ? "Guardando..." : isEdit ? "Actualizar" : "Crear Auspiciante"}
          </Button>
          <Link href="/admin/auspiciantes">
            <Button type="button" variant="outline" className="border-white/10">Cancelar</Button>
          </Link>
        </div>

        {mutation.error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
            Error al guardar. Verifica los datos e intenta de nuevo.
          </div>
        )}
      </form>
    </div>
  );
}
