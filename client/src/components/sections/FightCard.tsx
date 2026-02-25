import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import fighter1 from "@/assets/images/fighter_1.jpg";
import fighter2 from "@/assets/images/fighter_2.jpg";
import fightWeekImg from "@assets/fight-week.jpeg";
import mainCardImg from "@assets/main-card.jpeg";
import prelimsCardImg from "@assets/prelims-card.jpeg";
import undercardImg from "@assets/undercard.jpeg";
import type { MatchupWithFighters } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { effectiveTicketUrl } from "@/lib/utils";

interface FightCardProps {
  matchups: MatchupWithFighters[];
  ticketUrl: string | null;
}

const sectionLabels: Record<string, string> = {
  main: "Main Card",
  prelim: "Preliminares",
  undercard: "Undercard",
};

const MatchupModal = ({ matchup }: { matchup: MatchupWithFighters }) => {
  const red = matchup.redCorner;
  const blue = matchup.blueCorner;
  const isEstelar = matchup.label === "EVENTO ESTELAR";

  const redName = red ? red.lastName.toUpperCase() : "TBD";
  const blueName = blue ? blue.lastName.toUpperCase() : "TBD";

  const stats = [
    {
      label: "RÉCORD",
      red: red ? `${red.wins}–${red.losses}–${red.draws}` : null,
      blue: blue ? `${blue.wins}–${blue.losses}–${blue.draws}` : null,
    },
    {
      label: "KOs",
      red: red?.kos ?? null,
      blue: blue?.kos ?? null,
    },
    {
      label: "NACIÓN",
      red: red?.nationality ?? null,
      blue: blue?.nationality ?? null,
    },
    {
      label: "GUARDIA",
      red: red?.stance ?? null,
      blue: blue?.stance ?? null,
    },
    {
      label: "ALTURA",
      red: red?.heightCm ? `${red.heightCm} cm` : null,
      blue: blue?.heightCm ? `${blue.heightCm} cm` : null,
    },
    {
      label: "ALCANCE",
      red: red?.reachCm ? `${red.reachCm} cm` : null,
      blue: blue?.reachCm ? `${blue.reachCm} cm` : null,
    },
  ].filter((s) => s.red !== null || s.blue !== null);

  return (
    <div>
      <DialogTitle className="sr-only">
        {redName} vs {blueName}
      </DialogTitle>

      {/* Red accent bar */}
      <div className="h-1 w-full bg-primary box-glow" />

      {/* Header */}
      <div className="px-8 pt-6 pb-4 flex flex-col items-center gap-1">
        {matchup.label && (
          <span
            className={`px-4 py-1 font-display text-xs tracking-widest mb-1 ${
              isEstelar
                ? "bg-primary text-white box-glow"
                : "bg-white/10 border border-white/20 text-white"
            }`}
          >
            {matchup.label}
          </span>
        )}
        <span className="text-accent font-semibold tracking-[0.2em] text-xs">
          {matchup.rounds} ROUNDS — {matchup.weightLbs} LBS
        </span>
      </div>

      {/* Fighter comparison */}
      <div className="px-8 pb-6">
        <div className="flex items-end justify-between gap-4">
          {/* Red Corner */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="h-40 overflow-hidden mb-3">
              <img
                src={red?.photoUrl || fighter1}
                alt={red ? `${red.firstName} ${red.lastName}` : "TBD"}
                className="h-full w-auto object-cover object-top"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                }}
              />
            </div>
            <h3 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tighter">
              {redName}
            </h3>
            {red && (
              <p className="font-sans text-sm text-white/60 mt-0.5">
                {red.firstName}
              </p>
            )}
            {red?.nickname && (
              <p className="font-sans text-xs text-primary/80 italic mt-0.5">
                "{red.nickname}"
              </p>
            )}
          </div>

          {/* VS */}
          <div className="flex-shrink-0 pb-10">
            <span className="font-display text-primary text-4xl italic text-glow drop-shadow-[0_0_15px_rgba(227,27,35,0.8)]">
              VS
            </span>
          </div>

          {/* Blue Corner */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="h-40 overflow-hidden mb-3">
              <img
                src={blue?.photoUrl || fighter2}
                alt={blue ? `${blue.firstName} ${blue.lastName}` : "TBD"}
                className="h-full w-auto object-cover object-top scale-x-[-1]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                }}
              />
            </div>
            <h3 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tighter">
              {blueName}
            </h3>
            {blue && (
              <p className="font-sans text-sm text-white/60 mt-0.5">
                {blue.firstName}
              </p>
            )}
            {blue?.nickname && (
              <p className="font-sans text-xs text-primary/80 italic mt-0.5">
                "{blue.nickname}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats & Result */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="px-8 pb-8"
      >
        {stats.length > 0 && (
          <div className="border-t border-white/10 pt-4">
            <p className="text-center font-display text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-4">
              Estadísticas
            </p>
            <div className="space-y-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="grid grid-cols-3 items-center gap-2"
                >
                  <span className="text-right font-display text-sm text-white">
                    {stat.red !== null ? String(stat.red) : "—"}
                  </span>
                  <span className="text-center font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    {stat.label}
                  </span>
                  <span className="text-left font-display text-sm text-white">
                    {stat.blue !== null ? String(stat.blue) : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {matchup.result && (
          <div
            className={`${stats.length > 0 ? "mt-6" : ""} pt-4 border-t border-white/10 text-center`}
          >
            <span className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Resultado
            </span>
            <p className="font-display text-2xl text-primary mt-1 uppercase tracking-wide">
              {matchup.result}
              {matchup.resultMethod && ` · ${matchup.resultMethod}`}
              {matchup.resultRound && ` · Rnd ${matchup.resultRound}`}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const FightMatchup = ({
  matchup,
  index,
  isMain,
}: {
  matchup: MatchupWithFighters;
  index: number;
  isMain: boolean;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!rowRef.current) return;
    const el = rowRef.current;
    const handleEnter = () => {
      gsap.to(el, {
        boxShadow: "0 0 30px rgba(227, 27, 35, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      });
    };
    const handleLeave = () => {
      gsap.to(el, {
        boxShadow: "0 0 0px rgba(227, 27, 35, 0)",
        duration: 0.3,
        ease: "power2.out",
      });
    };
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const redName = matchup.redCorner
    ? matchup.redCorner.lastName.toUpperCase()
    : "TBD";
  const blueName = matchup.blueCorner
    ? matchup.blueCorner.lastName.toUpperCase()
    : "TBD";
  const isEstelar = matchup.label === "EVENTO ESTELAR";

  return (
    <>
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        onClick={() => setOpen(true)}
        className={`relative border-b border-white/10 ${isEstelar ? "py-16" : "py-10"} group cursor-pointer`}
      >
        {/* Hover Background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Fight Info Badge */}
          <div className="flex flex-col items-center justify-center mb-6">
            {matchup.label && (
              <span
                className={`px-4 py-1 font-display text-sm tracking-widest mb-3 ${
                  isEstelar
                    ? "bg-primary text-white box-glow"
                    : "bg-white/10 border border-white/20 text-white"
                }`}
              >
                {matchup.label}
              </span>
            )}
            <span className="text-accent font-semibold tracking-[0.2em] text-xs md:text-sm">
              {matchup.rounds} ROUNDS — {matchup.weightLbs} LBS
            </span>
          </div>

          {/* Fighters Layout */}
          <div className="flex items-center justify-between md:justify-center md:gap-24 relative">
            {/* Red Corner (Left) */}
            <div className="flex items-center gap-4 md:gap-8 w-2/5 md:w-auto justify-end">
              <h3
                className={`font-display text-right text-white uppercase tracking-tighter ${
                  isEstelar
                    ? "text-4xl md:text-7xl lg:text-8xl"
                    : "text-3xl md:text-5xl lg:text-6xl"
                }`}
              >
                {redName}
              </h3>
              <div
                className={`hidden md:block overflow-hidden grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-500 ${
                  isEstelar
                    ? "w-32 h-32 lg:w-48 lg:h-48"
                    : "w-24 h-24 lg:w-32 lg:h-32"
                }`}
              >
                <img
                  src={matchup.redCorner?.photoUrl || fighter1}
                  alt={redName}
                  className="w-full h-full object-cover object-top"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 50%, transparent 100%)",
                  }}
                />
              </div>
            </div>

            {/* VS Divider */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
              <span className="font-display text-primary text-4xl md:text-6xl italic text-glow drop-shadow-[0_0_15px_rgba(227,27,35,0.8)]">
                VS
              </span>
            </div>

            {/* Blue Corner (Right) */}
            <div className="flex items-center gap-4 md:gap-8 w-2/5 md:w-auto justify-start">
              <div
                className={`hidden md:block overflow-hidden grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-500 ${
                  isEstelar
                    ? "w-32 h-32 lg:w-48 lg:h-48"
                    : "w-24 h-24 lg:w-32 lg:h-32"
                }`}
              >
                <img
                  src={matchup.blueCorner?.photoUrl || fighter2}
                  alt={blueName}
                  className="w-full h-full object-cover object-top scale-x-[-1]"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 50%, transparent 100%)",
                  }}
                />
              </div>
              <h3
                className={`font-display text-left text-white uppercase tracking-tighter ${
                  isEstelar
                    ? "text-4xl md:text-7xl lg:text-8xl"
                    : "text-3xl md:text-5xl lg:text-6xl"
                }`}
              >
                {blueName}
              </h3>
            </div>
          </div>
        </div>

        {/* Hover affordance */}
        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-[10px] font-display tracking-[0.3em] text-white/60 uppercase pointer-events-none">
          Ver Detalles →
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-card border-white/10 rounded-none p-0 overflow-hidden gap-0">
          <MatchupModal matchup={matchup} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function FightCard({ matchups, ticketUrl }: FightCardProps) {
  // Group matchups by card section
  const sections = ["main", "prelim", "undercard"] as const;
  const grouped = sections
    .map((section) => ({
      key: section,
      label: sectionLabels[section],
      fights: matchups
        .filter((m) => m.cardSection === section)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter((g) => g.fights.length > 0);

  const totalFights = matchups.length;

  return (
    <section id="cartelera" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block relative"
        >
          <h2 className="font-display text-6xl md:text-8xl lg:text-[8rem] text-white uppercase tracking-tight">
            Cartelera{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px white" }}
            >
              Pro
            </span>
          </h2>
          <div className="absolute -bottom-4 left-0 right-0 h-2 bg-primary transform -skew-x-12 box-glow" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 font-sans text-muted-foreground uppercase tracking-[0.2em] font-medium text-sm md:text-base"
        >
          {totalFights} peleas profesionales — una noche de boxeo de élite
        </motion.p>

        {/* Fight Card Posters */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[
            { src: fightWeekImg, label: "Media Week", delay: 0.05 },
            { src: mainCardImg, label: "Main Card", delay: 0.1 },
            { src: prelimsCardImg, label: "Preliminares", delay: 0.25 },
            { src: undercardImg, label: "Undercard", delay: 0.4 },
          ].map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: card.delay }}
              className="group relative flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-px h-4 bg-primary shrink-0" />
                <span className="font-display text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-white/80 transition-colors duration-300">
                  {card.label}
                </span>
              </div>
              <div className="relative overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-500">
                <img
                  src={card.src}
                  alt={card.label}
                  className="w-full max-h-[50vh] object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ background: "#0a0a0a" }}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.04] transition-all duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {grouped.map((group) => (
        <div key={group.key}>
          {/* Section Header */}
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 mb-2 mt-12"
            >
              <div className="w-1 h-8 bg-primary" />
              <h3 className="font-display text-2xl md:text-3xl text-white/70 uppercase tracking-widest">
                {group.label}
              </h3>
            </motion.div>
          </div>

          <div className="border-t border-white/10">
            {group.fights.map((matchup, index) => (
              <FightMatchup
                key={matchup.id}
                matchup={matchup}
                index={index}
                isMain={matchup.label === "EVENTO ESTELAR"}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-20 text-center">
        {ticketUrl && (
          <a
            href={effectiveTicketUrl(ticketUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-display text-2xl uppercase tracking-widest px-12 py-4 transition-all hover:box-glow"
            data-testid="link-buy-tickets-card"
          >
            Asegura Tu Entrada
          </a>
        )}
      </div>
    </section>
  );
}
