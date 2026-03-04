import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/admin/ImageUploader";
import { apiRequest } from "@/lib/queryClient";
import type { Fighter } from "@shared/types";

const fighterFormSchema = z.object({
  firstName: z.string().min(1, "Requerido"),
  lastName: z.string().min(1, "Requerido"),
  nickname: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().default("male"),
  weightClass: z.string().optional().nullable(),
  weightLbs: z.coerce.number().optional().nullable(),
  heightCm: z.coerce.number().optional().nullable(),
  reachCm: z.coerce.number().optional().nullable(),
  stance: z.string().optional().nullable(),
  wins: z.coerce.number().default(0),
  losses: z.coerce.number().default(0),
  draws: z.coerce.number().default(0),
  kos: z.coerce.number().default(0),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isAmateur: z.boolean().default(false),
});

type FighterFormValues = z.infer<typeof fighterFormSchema>;

export default function FighterForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isEdit = !!params.id;

  const { data: fighter } = useQuery<Fighter>({
    queryKey: [`/api/fighters/${params.id}`],
    enabled: isEdit,
    queryFn: async () => {
      const fighters = await (await fetch("/api/fighters", { credentials: "include" })).json();
      return fighters.find((f: Fighter) => f.id === params.id);
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FighterFormValues>({
    resolver: zodResolver(fighterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      wins: 0,
      losses: 0,
      draws: 0,
      kos: 0,
      isActive: true,
      isAmateur: false,
    },
  });

  useEffect(() => {
    if (fighter) {
      reset({
        firstName: fighter.firstName,
        lastName: fighter.lastName,
        nickname: fighter.nickname,
        nationality: fighter.nationality,
        city: fighter.city,
        dateOfBirth: fighter.dateOfBirth,
        gender: fighter.gender,
        weightClass: fighter.weightClass,
        weightLbs: fighter.weightLbs,
        heightCm: fighter.heightCm,
        reachCm: fighter.reachCm,
        stance: fighter.stance,
        wins: fighter.wins,
        losses: fighter.losses,
        draws: fighter.draws,
        kos: fighter.kos,
        bio: fighter.bio,
        photoUrl: fighter.photoUrl,
        instagram: fighter.instagram,
        facebook: fighter.facebook,
        tiktok: fighter.tiktok,
        isActive: fighter.isActive,
        isAmateur: fighter.isAmateur,
      });
    }
  }, [fighter, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FighterFormValues) => {
      if (isEdit) {
        await apiRequest("PUT", `/api/fighters/${params.id}`, data);
      } else {
        await apiRequest("POST", "/api/fighters", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fighters"] });
      setLocation("/admin/peleadores");
    },
  });

  const photoUrl = watch("photoUrl");

  return (
    <div>
      <Link href="/admin/peleadores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white text-sm font-semibold uppercase tracking-wider mb-6">
        <ArrowLeft className="w-4 h-4" /> Peleadores
      </Link>

      <h1 className="font-display text-3xl text-white uppercase tracking-tight mb-8">
        {isEdit ? "Editar Peleador" : "Nuevo Peleador"}
      </h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-3xl space-y-8">
        {/* Amateur toggle */}
        <div className="flex items-center gap-3 bg-card border border-white/10 p-4">
          <Switch
            checked={watch("isAmateur")}
            onCheckedChange={(v) => setValue("isAmateur", v)}
          />
          <div>
            <Label className="text-white font-semibold">Amateur</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {watch("isAmateur") ? "Este peleador es amateur" : "Este peleador es profesional"}
            </p>
          </div>
        </div>

        {/* Basic Info */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Información Básica</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input {...register("firstName")} className="bg-card border-white/10" />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Apellido *</Label>
              <Input {...register("lastName")} className="bg-card border-white/10" />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Apodo</Label>
              <Input {...register("nickname")} className="bg-card border-white/10" placeholder='"El Destructor"' />
            </div>
            <div className="space-y-2">
              <Label>Nacionalidad</Label>
              <Input {...register("nationality")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input {...register("city")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Input type="date" {...register("dateOfBirth")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Género</Label>
              <select {...register("gender")} className="w-full bg-card border border-white/10 px-3 py-2 text-sm text-white">
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Physical */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Datos Físicos</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>División</Label>
              <select {...register("weightClass")} className="w-full bg-card border border-white/10 px-3 py-2 text-sm text-white">
                <option value="">Seleccionar...</option>
                <option value="flyweight">Mosca (112 lbs)</option>
                <option value="bantamweight">Gallo (118 lbs)</option>
                <option value="featherweight">Pluma (126 lbs)</option>
                <option value="super featherweight">Super Pluma (130 lbs)</option>
                <option value="lightweight">Ligero (132 lbs)</option>
                <option value="super lightweight">Super Ligero (140 lbs)</option>
                <option value="welterweight">Welter (147 lbs)</option>
                <option value="middleweight">Medio (160 lbs)</option>
                <option value="light heavyweight">Semi Pesado (175 lbs)</option>
                <option value="heavyweight">Pesado (200+ lbs)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Peso (lbs)</Label>
              <Input type="number" {...register("weightLbs")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Estatura (cm)</Label>
              <Input type="number" {...register("heightCm")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Alcance (cm)</Label>
              <Input type="number" {...register("reachCm")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Guardia</Label>
              <select {...register("stance")} className="w-full bg-card border border-white/10 px-3 py-2 text-sm text-white">
                <option value="">Seleccionar...</option>
                <option value="orthodox">Ortodoxa</option>
                <option value="southpaw">Zurda</option>
                <option value="switch">Switch</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Record */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Récord</legend>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Victorias</Label>
              <Input type="number" {...register("wins")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Derrotas</Label>
              <Input type="number" {...register("losses")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Empates</Label>
              <Input type="number" {...register("draws")} className="bg-card border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>KOs</Label>
              <Input type="number" {...register("kos")} className="bg-card border-white/10" />
            </div>
          </div>
        </fieldset>

        {/* Photo */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Foto</legend>
          <ImageUploader
            value={photoUrl}
            onChange={(url) => setValue("photoUrl", url)}
            category="fighter"
          />
        </fieldset>

        {/* Social */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Redes Sociales</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input {...register("instagram")} className="bg-card border-white/10" placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input {...register("facebook")} className="bg-card border-white/10" placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input {...register("tiktok")} className="bg-card border-white/10" placeholder="https://tiktok.com/..." />
            </div>
          </div>
        </fieldset>

        {/* Bio */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg text-white/60 uppercase tracking-widest mb-4">Biografía</legend>
          <Textarea {...register("bio")} className="bg-card border-white/10 min-h-[120px]" placeholder="Biografía del peleador..." />
        </fieldset>

        {/* Active */}
        <div className="flex items-center gap-3">
          <Switch
            checked={watch("isActive")}
            onCheckedChange={(v) => setValue("isActive", v)}
          />
          <Label>Activo</Label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 px-8">
            {mutation.isPending ? "Guardando..." : isEdit ? "Actualizar" : "Crear Peleador"}
          </Button>
          <Link href="/admin/peleadores">
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
