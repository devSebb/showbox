import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import poster from "@assets/Screenshot_2026-02-23_at_9.09.33_PM_1771898976524.png";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date: March 21, 2026 19:00:00 (Ecuador time / roughly standard)
    const targetDate = new Date("2026-03-21T19:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

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
  }, []);

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
            {/* Subtle inner glow */}
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

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="w-full h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url(${poster})` }}
          />
        </motion.div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
      </div>

      {/* Floating Particles/Embers (Simple CSS animation representation) */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[60%] left-[80%] w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[60%] w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="absolute top-[80%] left-[30%] w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block border border-white/20 px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-sm">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Showbox Promotions EC Presenta
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[7rem] leading-[0.9] text-white uppercase tracking-normal mb-2">
            Quorum Quito<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Fight Night</span><br />
            <span className="text-primary text-glow">XIII</span>
          </h1>

          <p className="font-display text-xl md:text-3xl text-white uppercase tracking-wider mb-8">
            By <span className="text-[#00FF00]">Forbet</span> — Pronostica y Gana
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <CountdownTimer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <a
            href="https://buenplan.com.ec"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-display text-xl uppercase tracking-widest px-10 py-4 transition-all hover:box-glow hover:-translate-y-1"
            data-testid="link-buy-tickets-hero"
          >
            Comprar Boletos
          </a>
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
          <span className="text-primary">📍</span> Quito, Ecuador — Sábado 21 de Marzo, 2026
        </motion.p>
      </div>
      
      {/* Aggressive angled divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background clip-slash-bottom z-20" />
    </section>
  );
}