import { motion } from "framer-motion";
import fighter1 from "@assets/images/fighter_1.jpg";
import fighter2 from "@assets/images/fighter_2.jpg";

const fights = [
  {
    id: 1,
    redCorner: "BONE",
    blueCorner: "RANGEL",
    weight: "147 LBS",
    rounds: "8 ROUNDS",
    tag: "EVENTO ESTELAR",
    isMain: true,
  },
  {
    id: 2,
    redCorner: "VERA",
    blueCorner: "ESPINOZA",
    weight: "138 LBS",
    rounds: "8 ROUNDS",
    tag: "CO-ESTELAR",
    isMain: false,
  },
  {
    id: 3,
    redCorner: "SANCHEZ",
    blueCorner: "LAJE",
    weight: "130 LBS",
    rounds: "8 ROUNDS",
    isMain: false,
  },
  {
    id: 4,
    redCorner: "INGA",
    blueCorner: "PULUPA",
    weight: "126 LBS",
    rounds: "6 ROUNDS",
    isMain: false,
  },
];

const FightMatchup = ({ fight, index }: { fight: typeof fights[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative border-b border-white/10 ${fight.isMain ? 'py-16' : 'py-10'} group`}
    >
      {/* Hover Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Fight Info Badge */}
        <div className="flex flex-col items-center justify-center mb-6">
          {fight.tag && (
            <span className={`px-4 py-1 font-display text-sm tracking-widest mb-3 ${fight.isMain ? 'bg-primary text-white box-glow' : 'bg-white/10 border border-white/20 text-white'}`}>
              {fight.tag}
            </span>
          )}
          <span className="text-accent font-semibold tracking-[0.2em] text-xs md:text-sm">
            {fight.rounds} — {fight.weight}
          </span>
        </div>

        {/* Fighters Layout */}
        <div className="flex items-center justify-between md:justify-center md:gap-24 relative">
          
          {/* Red Corner (Left) */}
          <div className="flex items-center gap-4 md:gap-8 w-2/5 md:w-auto justify-end">
            <h3 className={`font-display text-right text-white uppercase tracking-tighter ${fight.isMain ? 'text-4xl md:text-7xl lg:text-8xl' : 'text-3xl md:text-5xl lg:text-6xl'}`}>
              {fight.redCorner}
            </h3>
            <div className={`hidden md:block overflow-hidden grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-500 ${fight.isMain ? 'w-32 h-32 lg:w-48 lg:h-48' : 'w-24 h-24 lg:w-32 lg:h-32'}`}>
              <img src={fighter1} alt={fight.redCorner} className="w-full h-full object-cover object-top mask-image-linear-to-b" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
            </div>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
            <span className="font-display text-primary text-4xl md:text-6xl italic text-glow drop-shadow-[0_0_15px_rgba(227,27,35,0.8)]">VS</span>
          </div>

          {/* Blue Corner (Right) */}
          <div className="flex items-center gap-4 md:gap-8 w-2/5 md:w-auto justify-start">
             <div className={`hidden md:block overflow-hidden grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-500 ${fight.isMain ? 'w-32 h-32 lg:w-48 lg:h-48' : 'w-24 h-24 lg:w-32 lg:h-32'}`}>
              <img src={fighter2} alt={fight.blueCorner} className="w-full h-full object-cover object-top mask-image-linear-to-b scale-x-[-1]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
            </div>
            <h3 className={`font-display text-left text-white uppercase tracking-tighter ${fight.isMain ? 'text-4xl md:text-7xl lg:text-8xl' : 'text-3xl md:text-5xl lg:text-6xl'}`}>
              {fight.blueCorner}
            </h3>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default function FightCard() {
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
            Cartelera <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Pro</span>
          </h2>
          {/* Red slash accent */}
          <div className="absolute -bottom-4 left-0 right-0 h-2 bg-primary transform -skew-x-12 box-glow" />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 font-sans text-muted-foreground uppercase tracking-[0.2em] font-medium text-sm md:text-base"
        >
          4 peleas profesionales — una noche de boxeo de élite
        </motion.p>
      </div>

      <div className="border-t border-white/10 mt-12">
        {fights.map((fight, index) => (
          <FightMatchup key={fight.id} fight={fight} index={index} />
        ))}
      </div>

      <div className="mt-20 text-center">
        <a
          href="https://buenplan.com.ec"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-display text-2xl uppercase tracking-widest px-12 py-4 transition-all hover:box-glow"
          data-testid="link-buy-tickets-card"
        >
          Asegura Tu Entrada
        </a>
      </div>
    </section>
  );
}