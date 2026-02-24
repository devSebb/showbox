export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">
          {message || "Cargando..."}
        </span>
      </div>
    </div>
  );
}
