import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import gallery1 from "@/assets/images/gallery_1.jpeg";
import gallery2 from "@/assets/images/gallery_2.jpeg";
import gallery3 from "@/assets/images/gallery_3.jpg";
import gallery4 from "@/assets/images/gallery_4.jpeg";

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const images = [gallery1, gallery2, gallery3, gallery4];

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tight text-center">
          Experiencias de{" "}
          <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>
            Marca
          </span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row w-full h-[60vh] md:h-[70vh]">
        {images.map((img, index) => (
          <div
            key={index}
            className="gallery-item flex-1 relative overflow-hidden group border-r border-background cursor-crosshair"
          >
            <img
              src={img}
              alt="Fight Night Moment"
              className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
              <span className="font-display text-3xl text-white uppercase tracking-widest drop-shadow-lg">
                Showbox
              </span>
              <span className="w-12 h-1 bg-primary mt-2 box-glow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
