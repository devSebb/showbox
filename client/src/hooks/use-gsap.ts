import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function useGSAPContext(scope: React.RefObject<HTMLElement | null>) {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!scope.current) return;
    ctx.current = gsap.context(() => {}, scope.current);
    return () => {
      ctx.current?.revert();
    };
  }, [scope]);

  return ctx;
}
