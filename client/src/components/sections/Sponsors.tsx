import { motion } from "framer-motion";

export default function Sponsors() {
  // Creating purely text-based stylized representations since we don't have all logo files
  const sponsors = [
    { name: "Forbet", isTitle: true, color: "#00FF00" },
    { name: "Induvallas" },
    { name: "Grupo" },
    { name: "Deepal by Changan" },
    { name: "Oriental" },
    { name: "El Universo" },
    { name: "Snap Shot" },
    { name: "CCQ" },
    { name: "Social Magazine" },
    { name: "Chango" },
    { name: "IMD" },
  ];

  return (
    <section className="py-20 border-t border-b border-white/5 bg-black overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h3 className="text-center font-display text-2xl md:text-3xl uppercase tracking-widest text-muted-foreground">
          Con El Auspicio De
        </h3>
      </div>

      {/* Title Sponsor */}
      <div className="flex justify-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <span className="font-display text-5xl md:text-7xl italic tracking-tighter" style={{ color: "#00FF00" }}>
            Forbet
          </span>
          <span className="text-xs tracking-[0.3em] text-white/50 uppercase mt-2 font-semibold">
            Pronostica y Gana
          </span>
        </motion.div>
      </div>

      {/* Scrolling Marquee */}
      <div className="relative w-full flex overflow-x-hidden">
        {/* Fading edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
        
        <motion.div
          className="flex items-center gap-16 md:gap-24 whitespace-nowrap px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {/* Double array for seamless loop */}
          {[...sponsors.filter(s => !s.isTitle), ...sponsors.filter(s => !s.isTitle)].map((sponsor, idx) => (
            <span 
              key={`${sponsor.name}-${idx}`} 
              className="font-display text-2xl md:text-4xl uppercase tracking-widest text-white/30 hover:text-white transition-colors duration-300 cursor-default"
            >
              {sponsor.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}