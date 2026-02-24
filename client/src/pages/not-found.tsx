import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <div className="pt-32 pb-24 text-center">
        <h1 className="font-display text-8xl md:text-[12rem] text-primary text-glow mb-4">404</h1>
        <h2 className="font-display text-3xl md:text-5xl text-white uppercase tracking-tight mb-6">
          Página No Encontrada
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase tracking-widest px-10 py-4 transition-all hover:box-glow"
        >
          <ArrowLeft className="w-5 h-5" /> Volver al Inicio
        </Link>
      </div>
      <Footer />
    </div>
  );
}
