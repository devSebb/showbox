import { motion } from "framer-motion";
import logo from "@assets/image_1771898956125.png";

export default function About() {
  const stats = [
    { value: "XIII", label: "Eventos Realizados" },
    { value: "50+", label: "Peleas Profesionales" },
    { value: "1000+", label: "Asistentes por Evento" },
  ];

  return (
    <section id="nosotros" className="py-32 bg-background relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-[0.03] pointer-events-none z-0 flex justify-center">
        <img src={logo} alt="" className="w-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-7xl text-white uppercase tracking-tight mb-8"
          >
            Showbox <span className="text-primary">Promotions EC</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed mb-20"
          >
            Somos la promotora de boxeo profesional líder en Ecuador. Desde nuestros inicios, hemos llevado el deporte de combate al más alto nivel, organizando eventos de clase mundial que combinan talento local con estándares internacionales. <span className="text-white">Showbox Promotions EC es sinónimo de adrenalina, espectáculo y boxeo de élite.</span>
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-white/10 py-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center"
              >
                <span className="font-display text-6xl md:text-7xl text-white mb-2 text-glow">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}