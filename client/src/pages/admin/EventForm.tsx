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
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/ImageUploader";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/types";

const eventFormSchema = z.object({
  title: z.string().min(1, "Requerido"),
  subtitle: z.string().optional().nullable(),
  slug: z.string().min(1, "Requerido"),
  date: z.string().min(1, "Requerido"),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
  posterUrl: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  ticketUrl: z.string().optional().nullable(),
  ticketCtaText: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.string().default("draft"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EventForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isEdit = !!params.id;

  const { data: event } = useQuery<Event>({
    queryKey: [`/api/events/${params.id}`],
    enabled: isEdit,
    queryFn: async () => {
      const events = await (await fetch("/api/events", { credentials: "include" })).json();
      return events.find((e: Event) => e.id === params.id);
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      date: "",
      status: "draft",
    },
  });

  const title = watch("title");
  const posterUrl = watch("posterUrl");
  const heroImageUrl = watch("heroImageUrl");

  // Auto-generate slug from title (only for new events)
  useEffect(() => {
    if (!isEdit && title) {
      setValue("slug", slugify(title));
    }
  }, [title, isEdit, setValue]);

  useEffect(() => {
    if (event) {
      const dateStr = new Date(event.date).toISOString().slice(0, 16);
      reset({
        title: event.title,
        subtitle: event.subtitle,
        slug: event.slug,
        date: dateStr,
        venue: event.venue,
        city: event.city,
        country: event.country,
        address: event.address,
        mapEmbedUrl: event.mapEmbedUrl,
        posterUrl: event.posterUrl,
        heroImageUrl: event.heroImageUrl,
        ticketUrl: event.ticketUrl,
        ticketCtaText: event.ticketCtaText,
        description: event.description,
        status: event.status,
      });
    }
  }, [event, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const payload = { ...data, date: new Date(data.date).toISOString() };
      if (isEdit) {
        await apiRequest("PUT", `/api/events/${params.id}`, payload);
      } else {
        await apiRequest("POST", "/api/events", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setLocation("/admin/eventos");
    },
  });

  return (
    <div>
      <Link href="/admin/eventos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white text-sm font-semibold uppercase tracking-wider mb-6">
        <ArrowLeft className="w-4 h-4" /> Eventos
      </Link>

      <h1 className="font-display text-3xl text-white uppercase tracking-tight mb-8">
        {isEdit ? "Editar Evento" : "Nuevo Evento"}
      </h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-3xl space-y-8">
        {/* Basic Info */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Información</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Título *</Label>
              <Input {...register("title")} className="bg-card border-white/10" placeholder="Quorum Quito Fight Night XIV" />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input {...register("subtitle")} className="bg-card border-white/10" placeholder='By Forbet — Pronostica y Gana' />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input {...register("slug")} className="bg-card border-white/10" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Fecha y Hora *</Label>
              <Input type="datetime-local" {...register("date")} className="bg-card border-white/10" />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <select {...register("status")} className="w-full bg-card border border-white/10 px-3 py-2 text-sm text-white">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="completed">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Venue */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Ubicación</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lugar</Label>
              <Input {...register("venue")} className="bg-card border-white/10" placeholder="Quorum Paseo San Francisco" />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input {...register("city")} className="bg-card border-white/10" placeholder="Quito" />
            </div>
            <div className="space-y-2">
              <Label>País</Label>
              <Input {...register("country")} className="bg-card border-white/10" placeholder="Ecuador" />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input {...register("address")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>URL Embed Mapa (Google Maps)</Label>
              <Input {...register("mapEmbedUrl")} className="bg-card border-white/10" placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>
        </fieldset>

        {/* Media */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Imágenes</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Poster</Label>
              <ImageUploader value={posterUrl} onChange={(url) => setValue("posterUrl", url)} category="event" />
            </div>
            <div className="space-y-2">
              <Label>Imagen Hero</Label>
              <ImageUploader value={heroImageUrl} onChange={(url) => setValue("heroImageUrl", url)} category="event" />
            </div>
          </div>
        </fieldset>

        {/* Tickets */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Boletos</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>URL de Boletos</Label>
              <Input {...register("ticketUrl")} className="bg-card border-white/10" placeholder="https://www.buenplan.com.ec/event/quorum-figth-xiii-2025-quito" />
            </div>
            <div className="space-y-2">
              <Label>Texto Botón</Label>
              <Input {...register("ticketCtaText")} className="bg-card border-white/10" placeholder="Comprar Boletos" />
            </div>
          </div>
        </fieldset>

        {/* Description */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Descripción</legend>
          <Textarea {...register("description")} className="bg-card border-white/10 min-h-[120px]" placeholder="Descripción del evento..." />
        </fieldset>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 px-8">
            {mutation.isPending ? "Guardando..." : isEdit ? "Actualizar" : "Crear Evento"}
          </Button>
          <Link href="/admin/eventos">
            <Button type="button" variant="outline" className="border-white/10">Cancelar</Button>
          </Link>
          {isEdit && (
            <Link href={`/admin/eventos/${params.id}/cartelera`}>
              <Button type="button" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Configurar Cartelera
              </Button>
            </Link>
          )}
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
