import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import type { EventWithMatchups } from "@shared/types";

interface SponsorsProps {
  sponsors: EventWithMatchups["sponsors"];
}

export default function Sponsors({ sponsors }: SponsorsProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeBronzeRef = useRef<HTMLDivElement>(null);

  // Group sponsors by tier
  const titleSponsors = sponsors.filter((s) => (s.tier || s.sponsor?.tier) === "title");
  const goldSponsors = sponsors.filter((s) => (s.tier || s.sponsor?.tier) === "gold");
  const silverSponsors = sponsors.filter((s) => (s.tier || s.sponsor?.tier) === "silver");
  const bronzeSponsors = sponsors.filter((s) => (s.tier || s.sponsor?.tier) === "bronze");

  // GSAP marquee for silver sponsors
  useEffect(() => {
    if (!marqueeRef.current) return;
    const el = marqueeRef.current;
    const inner = el.querySelector(".marquee-track") as HTMLElement;
    if (!inner) return;

    // Clone for seamless loop
    const clone = inner.cloneNode(true) as HTMLElement;
    el.appendChild(clone);

    const totalWidth = inner.offsetWidth;

    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(
      el.querySelectorAll(".marquee-track"),
      { x: 0 },
      {
        x: -totalWidth,
        duration: totalWidth / 80,
        ease: "none",
      },
    );

    el.addEventListener("mouseenter", () => tl.pause());
    el.addEventListener("mouseleave", () => tl.resume());

    return () => {
      tl.kill();
      // Remove cloned element
      if (clone.parentNode === el) {
        el.removeChild(clone);
      }
    };
  }, [silverSponsors.length]);

  // GSAP marquee for bronze sponsors
  useEffect(() => {
    if (!marqueeBronzeRef.current) return;
    const el = marqueeBronzeRef.current;
    const inner = el.querySelector(".marquee-track") as HTMLElement;
    if (!inner) return;

    const clone = inner.cloneNode(true) as HTMLElement;
    el.appendChild(clone);

    const totalWidth = inner.offsetWidth;

    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(
      el.querySelectorAll(".marquee-track"),
      { x: 0 },
      {
        x: -totalWidth,
        duration: totalWidth / 80,
        ease: "none",
      },
    );

    el.addEventListener("mouseenter", () => tl.pause());
    el.addEventListener("mouseleave", () => tl.resume());

    return () => {
      tl.kill();
      if (clone.parentNode === el) {
        el.removeChild(clone);
      }
    };
  }, [bronzeSponsors.length]);

  return (
    <section className="py-20 border-t border-b border-white/5 bg-black overflow-hidden">
      {/* Title Sponsor */}
      {titleSponsors.length > 0 && (
        <div className="flex justify-center mb-16">
          {titleSponsors.map((ts) => (
            <motion.div
              key={ts.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              {ts.sponsor?.logoUrl ? (
                <img
                  src={ts.sponsor.logoUrl}
                  alt={ts.sponsor.name}
                  className="h-24 md:h-36 w-auto mb-2 object-contain"
                />
              ) : (
                <span
                  className="font-display text-5xl md:text-7xl italic tracking-tighter"
                  style={{ color: ts.sponsor?.brandColor || "#00FF00" }}
                >
                  {ts.sponsor?.name}
                </span>
              )}
              {ts.sponsor?.tagline && (
                <span className="text-xs tracking-[0.3em] text-white/50 uppercase mt-2 font-semibold">
                  {ts.sponsor.tagline}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Gold Sponsors - "Presentado por" */}
      {goldSponsors.length > 0 && (
        <div className="container mx-auto px-4 mb-14">
          <h3 className="text-center font-display text-lg md:text-xl uppercase tracking-[0.3em] text-accent/80 mb-8">
            Presentado Por
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {goldSponsors.map((gs, idx) => (
              <motion.div
                key={gs.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                {gs.sponsor?.logoUrl ? (
                  <img
                    src={gs.sponsor.logoUrl}
                    alt={gs.sponsor.name}
                    className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="font-display text-2xl md:text-3xl uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300 cursor-default">
                    {gs.sponsor?.name}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Silver Sponsors - "Con el auspicio de" - GSAP marquee */}
      {silverSponsors.length > 0 && (
        <div className="mt-8">
          <div className="container mx-auto px-4 mb-6">
            <h3 className="text-center font-display text-sm md:text-base uppercase tracking-[0.3em] text-muted-foreground/60 mb-2">
              Con El Auspicio De
            </h3>
          </div>

          <div className="relative w-full flex overflow-x-hidden" ref={marqueeRef}>
            {/* Fading edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="marquee-track flex items-center gap-16 md:gap-24 whitespace-nowrap px-8 min-h-[3rem] md:min-h-[4rem]">
              {silverSponsors.map((ss) => (
                <div
                  key={ss.id}
                  className="flex items-center justify-center h-10 md:h-14 shrink-0"
                >
                  {ss.sponsor?.logoUrl ? (
                    <img
                      src={ss.sponsor.logoUrl}
                      alt={ss.sponsor.name}
                      className="h-10 md:h-14 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="font-display text-2xl md:text-4xl uppercase tracking-widest text-white/30 hover:text-white transition-colors duration-300 cursor-default">
                      {ss.sponsor?.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bronze Sponsors - "Con el apoyo de" - GSAP marquee */}
      {bronzeSponsors.length > 0 && (
        <div className="mt-8">
          <div className="container mx-auto px-4 mb-6">
            <h3 className="text-center font-display text-sm md:text-base uppercase tracking-[0.3em] text-muted-foreground/60 mb-2">
              Con El Apoyo De
            </h3>
          </div>

          <div className="relative w-full flex overflow-x-hidden" ref={marqueeBronzeRef}>
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="marquee-track flex items-center gap-16 md:gap-24 whitespace-nowrap px-8 min-h-[2rem] md:min-h-[3rem]">
              {bronzeSponsors.map((bs) => (
                <div
                  key={bs.id}
                  className="flex items-center justify-center h-8 md:h-12 shrink-0"
                >
                  {bs.sponsor?.logoUrl ? (
                    <img
                      src={bs.sponsor.logoUrl}
                      alt={bs.sponsor.name}
                      className="h-8 md:h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="font-display text-lg md:text-xl uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors duration-300 cursor-default">
                      {bs.sponsor?.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
