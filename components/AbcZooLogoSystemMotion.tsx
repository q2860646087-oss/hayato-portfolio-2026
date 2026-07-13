"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AbcZooLogoSystemMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const left = root.querySelector<HTMLElement>(".logo-system-left-motion");
      const right = root.querySelector<HTMLElement>(".logo-system-right-motion");
      const page = root.querySelector<HTMLElement>(".abczoo-layout-page--logo-system");
      if (!left || !right || !page) return;

      if (reducedMotion.matches || window.innerWidth <= 768) {
        left.style.transform = "none";
        right.style.transform = "none";
        left.style.opacity = "1";
        right.style.opacity = "1";
        return;
      }

      const viewportHeight = window.innerHeight;
      const rect = page.getBoundingClientRect();
      const startY = viewportHeight * 0.88;
      const endY = viewportHeight * 0.18;
      const progress = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)));
      const settled = progress >= 0.995;
      const offset = (1 - progress) * 65;
      const opacity = settled ? 1 : 0.25 + progress * 0.75;

      left.style.transform = settled ? "translate3d(0, 0, 0)" : `translate3d(-${offset}vw, 0, 0)`;
      right.style.transform = settled ? "translate3d(0, 0, 0)" : `translate3d(${offset}vw, 0, 0)`;
      left.style.opacity = String(opacity);
      right.style.opacity = String(opacity);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const mediaChange = () => requestUpdate();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", mediaChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", mediaChange);
    };
  }, []);

  return <div ref={rootRef} className="abczoo-logo-motion-root">{children}</div>;
}
