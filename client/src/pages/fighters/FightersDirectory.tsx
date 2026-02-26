import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { gsap } from "@/lib/gsap";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { Fighter } from "@shared/types";

const weightClasses = [
  { value: "", label: "Todas las divisiones" },
  { value: "flyweight", label: "Mosca (112 lbs)" },
  { value: "bantamweight", label: "Gallo (118 lbs)" },
  { value: "super bantamweight", label: "Super Gallo (122 lbs)" },
  { value: "featherweight", label: "Pluma (126 lbs)" },
  { value: "super featherweight", label: "Super Pluma (130 lbs)" },
  { value: "lightweight", label: "Ligero (132 lbs)" },
  { value: "super lightweight", label: "Super Ligero (140 lbs)" },
  { value: "welterweight", label: "Welter (147 lbs)" },
  { value: "super welterweight", label: "Super Welter (154 lbs)" },
  { value: "middleweight", label: "Medio (160 lbs)" },
  { value: "light heavyweight", label: "Semi Pesado (175 lbs)" },
  { value: "heavyweight", label: "Pesado (200+ lbs)" },
];

export default function FightersDirectory() {
  const [search, setSearch] = useState("");
  const [weightClass, setWeightClass] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: fighters, isLoading } = useQuery<Fighter[]>({
    queryKey: ["/api/public/fighters"],
  });

  // useEffect(() => {
  //   if (!gridRef.current || !fighters?.length) return;
  //   const ctx = gsap.context(() => {
  //     gsap.from(".fighter-card", {
  //       y: 30,
  //       opacity: 0,
  //       duration: 0.5,
  //       stagger: 0.05,
  //       ease: "power2.out",
  //       scrollTrigger: {
  //         trigger: gridRef.current,
  //         start: "top 90%",
  //         toggleActions: "play none none none",
  //       },
  //     });
  //   }, gridRef.current);
  //   return () => ctx.revert();
  // }, [fighters]);

  if (isLoading) return <LoadingSpinner />;

  const filtered = (fighters || []).filter((f) => {
    const matchesSearch =
      !search ||
      `${f.firstName} ${f.lastName} ${f.nickname || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesWeight = !weightClass || f.weightClass === weightClass;
    return matchesSearch && matchesWeight;
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-12 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] text-white uppercase tracking-tight mb-4">
            Peleadores
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">
            El talento del boxeo latinoamericano
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 -skew-x-12" />
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar peleador..."
                className="w-full bg-card border border-white/10 pl-11 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <select
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value)}
              className="bg-card border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm appearance-none cursor-pointer"
            >
              {weightClasses.map((wc) => (
                <option key={wc.value} value={wc.value} className="bg-card">
                  {wc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Fighters Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4" ref={gridRef}>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {search || weightClass
                  ? "No se encontraron peleadores con esos filtros."
                  : "No hay peleadores activos registrados."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filtered.map((fighter) => (
                <Link
                  key={fighter.id}
                  href={`/peleadores/${fighter.id}`}
                  className="fighter-card group block bg-card border border-white/5 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-card to-background">
                    {fighter.photoUrl ? (
                      <img
                        src={fighter.photoUrl}
                        alt={`${fighter.firstName} ${fighter.lastName}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-5xl text-white/10 uppercase">
                          {fighter.firstName.charAt(0)}
                          {fighter.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                    {/* Record overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-xs font-semibold text-white/80 tracking-wider">
                        {fighter.wins}W-{fighter.losses}L-{fighter.draws}D
                        {fighter.kos > 0 && (
                          <span className="text-primary ml-1">({fighter.kos} KO)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="p-3 md:p-4">
                    <h3 className="font-display text-sm md:text-base text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {fighter.firstName} {fighter.lastName}
                    </h3>
                    {fighter.nickname && (
                      <p className="text-xs text-muted-foreground italic mt-0.5 truncate">
                        "{fighter.nickname}"
                      </p>
                    )}
                    {fighter.weightClass && (
                      <p className="text-xs text-accent/70 uppercase tracking-wider mt-1 truncate">
                        {fighter.weightClass}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
