import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Instagram, Facebook } from "lucide-react";
import { gsap } from "@/lib/gsap";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { FighterWithHistory } from "@shared/types";

function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export default function FighterProfile() {
  const params = useParams<{ id: string }>();
  const profileRef = useRef<HTMLElement>(null);

  const { data: fighter, isLoading, error } = useQuery<FighterWithHistory>({
    queryKey: [`/api/public/fighters/${params.id}`],
  });

  useEffect(() => {
    if (!profileRef.current || !fighter) return;
    const ctx = gsap.context(() => {
      gsap.from(".profile-content", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".tape-stat", {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.3,
        ease: "power2.out",
      });
    }, profileRef.current);
    return () => ctx.revert();
  }, [fighter]);

  if (isLoading) return <LoadingSpinner />;

  if (error || !fighter) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <div className="pt-32 pb-24 text-center">
          <h1 className="font-display text-5xl text-white mb-4">Peleador No Encontrado</h1>
          <p className="text-muted-foreground mb-8">El peleador que buscas no existe.</p>
          <Link
            href="/peleadores"
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-semibold uppercase tracking-wider text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Ver Todos los Peleadores
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const age = calculateAge(fighter.dateOfBirth);
  const totalFights = fighter.wins + fighter.losses + fighter.draws;
  const winRate = totalFights > 0 ? Math.round((fighter.wins / totalFights) * 100) : 0;

  // Tale of tape stats
  const tapeStats = [
    { label: "Récord", value: `${fighter.wins}-${fighter.losses}-${fighter.draws}` },
    { label: "KOs", value: fighter.kos.toString() },
    ...(fighter.weightClass ? [{ label: "División", value: fighter.weightClass.replace(/^\w/, (c) => c.toUpperCase()) }] : []),
    ...(fighter.weightLbs ? [{ label: "Peso", value: `${fighter.weightLbs} lbs` }] : []),
    ...(fighter.heightCm ? [{ label: "Estatura", value: `${fighter.heightCm} cm` }] : []),
    ...(fighter.reachCm ? [{ label: "Alcance", value: `${fighter.reachCm} cm` }] : []),
    ...(fighter.stance ? [{ label: "Guardia", value: fighter.stance.replace(/^\w/, (c) => c.toUpperCase()) }] : []),
    ...(age ? [{ label: "Edad", value: `${age} años` }] : []),
    ...(fighter.nationality ? [{ label: "Nacionalidad", value: fighter.nationality }] : []),
    ...(totalFights > 0 ? [{ label: "% Victoria", value: `${winRate}%` }] : []),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <section ref={profileRef} className="pt-24 pb-24 relative">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            href="/peleadores"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Peleadores
          </Link>

          <div className="profile-content flex flex-col lg:flex-row gap-12 items-start">
            {/* Photo */}
            <div className="w-full lg:w-1/3 max-w-md">
              <div className="aspect-[3/4] relative overflow-hidden border border-white/10 bg-gradient-to-br from-card to-background">
                {fighter.photoUrl ? (
                  <img
                    src={fighter.photoUrl}
                    alt={`${fighter.firstName} ${fighter.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-8xl text-white/10 uppercase">
                      {fighter.firstName.charAt(0)}
                      {fighter.lastName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Record overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl text-white">
                      {fighter.wins}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Victorias</span>
                    <span className="font-display text-4xl text-white/40">
                      {fighter.losses}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Derrotas</span>
                    <span className="font-display text-4xl text-white/40">
                      {fighter.draws}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Empates</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(fighter.instagram || fighter.facebook || fighter.tiktok) && (
                <div className="flex gap-4 mt-4">
                  {fighter.instagram && (
                    <a href={fighter.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {fighter.facebook && (
                    <a href={fighter.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {fighter.tiktok && (
                    <a href={fighter.tiktok} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
                      <span className="font-display text-sm italic">d</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {fighter.nickname && (
                <p className="text-accent font-semibold uppercase tracking-[0.2em] text-sm mb-2">
                  "{fighter.nickname}"
                </p>
              )}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight mb-8">
                {fighter.firstName}{" "}
                <span className="text-primary">{fighter.lastName}</span>
              </h1>

              {/* Tale of Tape */}
              <div className="mb-12">
                <h2 className="font-display text-xl text-white/60 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary" />
                  Tale of the Tape
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {tapeStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="tape-stat bg-card border border-white/5 p-4 text-center"
                    >
                      <p className="font-display text-2xl md:text-3xl text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {fighter.bio && (
                <div className="mb-12">
                  <h2 className="font-display text-xl text-white/60 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary" />
                    Biografía
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {fighter.bio}
                  </p>
                </div>
              )}

              {/* Fight History */}
              {fighter.matchups && fighter.matchups.length > 0 && (
                <div>
                  <h2 className="font-display text-xl text-white/60 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary" />
                    Historial de Peleas
                  </h2>
                  <div className="space-y-3">
                    {fighter.matchups.map((m) => {
                      const opponentName = m.opponent
                        ? `${m.opponent.firstName} ${m.opponent.lastName}`
                        : "TBD";
                      const eventDate = new Date(m.event.date).toLocaleDateString("es-EC", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      });

                      let resultDisplay = null;
                      if (m.result) {
                        const isWin =
                          (m.corner === "red" && m.result === "red_win") ||
                          (m.corner === "blue" && m.result === "blue_win");
                        const isLoss =
                          (m.corner === "red" && m.result === "blue_win") ||
                          (m.corner === "blue" && m.result === "red_win");
                        resultDisplay = (
                          <span
                            className={`px-2 py-0.5 text-xs font-bold uppercase ${
                              isWin
                                ? "bg-green-900/30 text-green-400"
                                : isLoss
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-white/10 text-white/60"
                            }`}
                          >
                            {isWin ? "V" : isLoss ? "D" : m.result === "draw" ? "E" : "NC"}
                            {m.resultMethod && ` (${m.resultMethod})`}
                            {m.resultRound && ` R${m.resultRound}`}
                          </span>
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          className="flex items-center gap-4 bg-card border border-white/5 p-4 hover:border-white/10 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              vs <span className="uppercase">{opponentName}</span>
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{eventDate}</span>
                              <span>·</span>
                              <Link href={`/eventos/${m.event.slug}`} className="text-primary hover:underline">
                                {m.event.title}
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {m.rounds && (
                              <span className="text-xs text-muted-foreground">{m.rounds}R</span>
                            )}
                            {resultDisplay || (
                              <span className="px-2 py-0.5 text-xs font-bold uppercase bg-accent/20 text-accent">
                                Próx
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
