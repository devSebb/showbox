import { gsap, ScrollTrigger } from "./gsap";

export function heroParallax(element: HTMLElement) {
  return gsap.to(element, {
    yPercent: 30,
    scale: 1.1,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

export function sectionReveal(
  element: HTMLElement,
  options?: { y?: number; delay?: number; duration?: number },
) {
  const { y = 60, delay = 0, duration = 0.8 } = options || {};
  return gsap.from(element, {
    y,
    opacity: 0,
    duration,
    delay,
    ease: "power3.out",
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

export function staggerChildren(
  parent: HTMLElement,
  childSelector: string,
  options?: { y?: number; stagger?: number },
) {
  const { y = 40, stagger = 0.1 } = options || {};
  const children = parent.querySelectorAll(childSelector);
  if (!children.length) return null;

  return gsap.from(children, {
    y,
    opacity: 0,
    duration: 0.6,
    stagger,
    ease: "power2.out",
    scrollTrigger: {
      trigger: parent,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
}

export function fightCardHover(element: HTMLElement) {
  const handleEnter = () => {
    gsap.to(element, {
      boxShadow: "0 0 30px rgba(227, 27, 35, 0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleLeave = () => {
    gsap.to(element, {
      boxShadow: "0 0 0px rgba(227, 27, 35, 0)",
      duration: 0.3,
      ease: "power2.out",
    });
  };
  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("mouseleave", handleLeave);
  return () => {
    element.removeEventListener("mouseenter", handleEnter);
    element.removeEventListener("mouseleave", handleLeave);
  };
}

export function marqueeSmooth(
  element: HTMLElement,
  speed: number = 40,
) {
  const inner = element.firstElementChild as HTMLElement;
  if (!inner) return null;

  // Duplicate content for seamless loop
  const clone = inner.cloneNode(true) as HTMLElement;
  element.appendChild(clone);

  const totalWidth = inner.offsetWidth;

  const tl = gsap.timeline({ repeat: -1 });
  tl.fromTo(
    [inner, clone],
    { x: 0 },
    {
      x: -totalWidth,
      duration: totalWidth / (speed * 10),
      ease: "none",
    },
  );

  // Pause on hover
  element.addEventListener("mouseenter", () => tl.pause());
  element.addEventListener("mouseleave", () => tl.resume());

  return tl;
}
