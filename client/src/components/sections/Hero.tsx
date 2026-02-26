import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { EventWithMatchups } from "@shared/types";
import { effectiveTicketUrl } from "@/lib/utils";

interface HeroProps {
  title: string;
  subtitle: string | null;
  date: string | Date;
  venue: string | null;
  city: string | null;
  ticketUrl: string | null;
  heroImageUrl: string | null;
  sponsors: EventWithMatchups["sponsors"];
}

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = targetDate.getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeBlocks = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8 my-8">
      {timeBlocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="font-display text-3xl md:text-5xl text-primary text-glow">
              {block.value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Hero({ title, subtitle, date, venue, city, ticketUrl, heroImageUrl: _heroImageUrl, sponsors }: HeroProps) {
  const eventDate = new Date(date);

  // Find title sponsor for hero display
  const titleSponsor = sponsors?.find((s) => s.sponsor?.tier === "title");


  // Format date for display
  const dateStr = eventDate.toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Parse title parts for styling (e.g. "Quorum Quito Fight Night XIII")
  const titleParts = title.split(" ");
  const romanNumeral = titleParts[titleParts.length - 1];
  const hasRoman = /^[IVXLCDM]+$/.test(romanNumeral);
  const mainTitle = hasRoman ? titleParts.slice(0, -1) : titleParts;
  const midPoint = Math.ceil(mainTitle.length / 2);
  const line1 = mainTitle.slice(0, midPoint).join(" ");
  const line2 = mainTitle.slice(midPoint).join(" ");

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Dark animated boxing background */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Subtle boxing ring ropes — horizontal lines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-[15%] left-0 right-0 h-px bg-white" />
          <div className="absolute top-[30%] left-0 right-0 h-px bg-white" />
          <div className="absolute top-[50%] left-0 right-0 h-px bg-white" />
          <div className="absolute top-[70%] left-0 right-0 h-px bg-white" />
          <div className="absolute top-[85%] left-0 right-0 h-px bg-white" />
        </div>

        {/* Animated pixel grid — appearing/disappearing sparks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary rounded-full"
              style={{
                left: `${8 + (i * 4) % 88}%`,
                top: `${12 + (i * 7) % 76}%`,
                animation: `hero-pixel-fade ${4 + (i % 5)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`a-${i}`}
              className="absolute w-0.5 h-0.5 bg-accent/80 rounded-full"
              style={{
                left: `${15 + (i * 7) % 70}%`,
                top: `${20 + (i * 6) % 60}%`,
                animation: `hero-pixel-fade ${5 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.5 + 1}s`,
              }}
            />
          ))}
        </div>

        {/* Floating ambient particles — drifting */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[25%] left-[20%] w-1 h-1 bg-primary/60 rounded-full" style={{ animation: "hero-float-slow 8s ease-in-out infinite" }} />
          <div className="absolute top-[45%] left-[75%] w-1.5 h-1.5 bg-primary/40 rounded-full" style={{ animation: "hero-float-slower 12s ease-in-out infinite", animationDelay: "2s" }} />
          <div className="absolute top-[60%] left-[35%] w-1 h-1 bg-accent/50 rounded-full" style={{ animation: "hero-float-slow 10s ease-in-out infinite", animationDelay: "1s" }} />
          <div className="absolute top-[15%] left-[65%] w-0.5 h-0.5 bg-white/30 rounded-full" style={{ animation: "hero-float-slower 15s ease-in-out infinite", animationDelay: "3s" }} />
          <div className="absolute top-[80%] left-[55%] w-1 h-1 bg-primary/50 rounded-full" style={{ animation: "hero-float-slow 9s ease-in-out infinite", animationDelay: "0.5s" }} />
        </div>

        {/* Subtle pulsing center vignette — red wash */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(227,27,35,0.12)_0%,transparent_70%)] pointer-events-none"
          style={{ animation: "hero-pulse-subtle 6s ease-in-out infinite" }}
        />

        {/* Gradient overlays for depth */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(0,0,0,0.9)_100%)]" /> */}
      </div>

      {/* Floating accent particles */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute top-[60%] left-[80%] w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[60%] w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDuration: "5s", animationDelay: "2s" }} />
        <div className="absolute top-[80%] left-[30%] w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/showbox_logo.png"
            alt="Showbox Promotions EC"
            className="max-w-[240px] sm:max-w-[320px] md:max-w-[420px] lg:max-w-[520px] xl:max-w-[600px] w-full mx-auto object-contain mb-6"
          />

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.9] text-white uppercase tracking-normal mb-2">
            {line1 === "Quorum Quito" ? (
              <img
                src="/qfn-quorum-quito-logo.png"
                alt="Quorum Quito"
                className="max-w-[80px] sm:max-w-[120px] md:max-w-[160px] lg:max-w-[180px] w-full mx-auto object-contain mb-8"
              />
            ) : (
              <>{line1}<br /></>
            )}
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>{line2}</span><br />
            {hasRoman && <span className="text-primary text-glow">{romanNumeral}</span>}
          </h1>

          {subtitle && titleSponsor?.sponsor && (
            <p className="font-display text-xl md:text-3xl text-white uppercase tracking-wider mb-8">
              By{" "}
              <span style={{ color: titleSponsor.sponsor.brandColor || "#00FF00" }}>
                {titleSponsor.sponsor.name}
              </span>
            </p>
          )}
          {subtitle && !titleSponsor && (
            <p className="font-display text-xl md:text-3xl text-white uppercase tracking-wider mb-8">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <CountdownTimer targetDate={eventDate} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          {ticketUrl && (
            <a
              href={effectiveTicketUrl(ticketUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase tracking-widest px-10 py-4 transition-all hover:box-glow hover:-translate-y-1"
              data-testid="link-buy-tickets-hero"
            >
              Comprar Boletos
            </a>
          )}
          <a
            href="#cartelera"
            className="w-full sm:w-auto border border-white hover:bg-white hover:text-black text-white font-display text-xl uppercase tracking-widest px-10 py-4 transition-all"
            data-testid="link-view-card"
          >
            Ver Cartelera
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-10 text-sm md:text-base font-medium text-muted-foreground tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <span className="text-primary">📍</span> {city || "Quito"}, Ecuador — {capitalizedDate}
        </motion.p>
      </div>

      {/* Aggressive angled divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background clip-slash-bottom z-20" />
    </section>
  );
}
