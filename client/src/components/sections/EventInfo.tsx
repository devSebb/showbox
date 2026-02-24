import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";

export default function EventInfo() {
  const infoItems = [
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Fecha",
      detail: "Sábado 21 de Marzo, 2026",
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Ubicación",
      detail: "Quorum Quito, Ecuador",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Hora de Inicio",
      detail: "19:00 (7:00 PM)",
    },
    {
      icon: <Ticket className="w-8 h-8 text-primary" />,
      title: "Boletos",
      detail: "Disponibles en BuenPlan",
      link: "https://buenplan.com.ec",
    },
  ];

  return (
    <section id="evento" className="py-24 bg-card relative clip-slash-top clip-slash-bottom -mt-16 -mb-16 z-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Info Cards */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border border-white/5 p-8 flex flex-col items-start hover:border-primary/50 transition-colors group"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="font-display text-xl text-white uppercase tracking-wider mb-2">
                  {item.title}
                </h4>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    {item.detail}
                  </a>
                ) : (
                  <p className="text-muted-foreground font-medium">
                    {item.detail}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map/Visual Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 aspect-video lg:aspect-square relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-background/50 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute inset-0 border border-white/10 z-20 pointer-events-none" />
            
            {/* Simple dark map placeholder using iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7997931343714!2d-78.4371991!3d-0.1906233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d591322abdf837%3A0xe545cdd62f90141a!2sQuorum%20Quito!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Overlay Accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/20 blur-3xl z-0" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}