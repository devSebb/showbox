import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Media } from "@shared/types";

const categories = [
  { value: "", label: "Todos" },
  { value: "fighter", label: "Peleadores" },
  { value: "event", label: "Eventos" },
  { value: "sponsor", label: "Auspiciantes" },
  { value: "gallery", label: "Galería" },
  { value: "general", label: "General" },
];

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media", category],
    queryFn: async () => {
      const url = category ? `/api/media?category=${category}` : "/api/media";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch media");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/media"] }),
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category || "general");
        await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-white uppercase tracking-tight">Media</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona imágenes y archivos</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            className="bg-primary hover:bg-primary/90 gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4" /> {uploading ? "Subiendo..." : "Subir"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
              category === cat.value
                ? "bg-primary/20 text-primary border-primary/40"
                : "bg-card text-muted-foreground border-white/10 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media?.map((item) => (
            <div key={item.id} className="bg-card border border-white/5 hover:border-white/10 transition-colors group">
              <div className="aspect-square bg-black/50 overflow-hidden relative">
                {item.mimeType?.startsWith("image/") ? (
                  <img src={item.url} alt={item.alt || ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="ghost" size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-primary"
                    onClick={() => copyUrl(item.id, item.url)}
                    title="Copiar URL"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-destructive"
                    onClick={() => {
                      if (confirm("¿Eliminar esta imagen?")) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-white truncate">{item.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.category} · {formatSize(item.size)}
                </p>
              </div>
            </div>
          ))}
          {(!media || media.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No hay archivos{category ? ` en la categoría "${categories.find(c => c.value === category)?.label}"` : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
