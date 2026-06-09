"use client";

import { useEffect, useRef } from "react";

type PixelBlastProps = {
  variant?: "square";
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function PixelBlast({
  pixelSize = 8,
  color = "#292f83",
  patternScale = 7.5,
  patternDensity = 1.9,
  enableRipples = true,
  rippleSpeed = 0.35,
  rippleThickness = 0.17,
  rippleIntensityScale = 1,
  speed = 0.5,
  edgeFade = 0.35,
}: PixelBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let animationFrame = 0;
    let disposed = false;
    const rgb = hexToRgb(color);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      if (disposed) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      context.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxDistance = Math.hypot(centerX, centerY);
      const step = Math.max(4, pixelSize);
      const time = reduceMotion ? 0 : frame * 0.018 * speed;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const dx = x + step / 2 - centerX;
          const dy = y + step / 2 - centerY;
          const distance = Math.hypot(dx, dy);
          const distanceRatio = distance / maxDistance;
          const fadeStart = Math.max(0.08, 1 - edgeFade);
          const edgeFadeAmount = Math.max(0, (distanceRatio - fadeStart) / Math.max(0.08, edgeFade));
          const edgeAlpha = Math.max(0.24, 1 - edgeFadeAmount);
          const field =
            Math.sin(x / (step * patternScale) + time) +
            Math.cos(y / (step * patternScale) - time * 0.85) +
            Math.sin((x + y) / (step * patternScale * 1.8));

          const threshold = 1.6 - patternDensity * 0.42;
          let alpha = field > threshold ? 0.34 : field > threshold - 0.45 ? 0.16 : 0;

          if (enableRipples) {
            const ripple =
              0.5 +
              0.5 *
                Math.sin(
                  distance / Math.max(14, step * 4) -
                    time * 10 * rippleSpeed,
                );
            const rippleBand = Math.pow(ripple, Math.max(2, 12 * (1 - rippleThickness)));
            alpha += rippleBand * 0.18 * rippleIntensityScale;
          }

          alpha *= edgeAlpha;

          if (alpha < 0.035) continue;

          context.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(alpha, 0.45)})`;
          context.fillRect(Math.round(x), Math.round(y), Math.ceil(step * 0.78), Math.ceil(step * 0.78));
        }
      }

      frame += 1;
      if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    draw();

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [color, edgeFade, enableRipples, patternDensity, patternScale, pixelSize, rippleIntensityScale, rippleSpeed, rippleThickness, speed]);

  return <canvas ref={canvasRef} className="hero-pixel-blast-canvas" />;
}

export function HeroPixelBlast() {
  return (
    <div className="hero-pixel-blast-layer pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-pixel-blast-field hero-pixel-blast-field-blue">
        <PixelBlast
          variant="square"
          pixelSize={8}
          color="#292f83"
          patternScale={8}
          patternDensity={1.8}
          enableRipples
          rippleSpeed={0.3}
          rippleThickness={0.14}
          rippleIntensityScale={0.8}
          speed={0.45}
          transparent
          edgeFade={0.45}
        />
      </div>
      <div className="hero-pixel-blast-field hero-pixel-blast-field-yellow">
        <PixelBlast
          variant="square"
          pixelSize={10}
          color="#f1cd42"
          patternScale={10}
          patternDensity={0.35}
          enableRipples={false}
          speed={0.25}
          transparent
          edgeFade={0.55}
        />
      </div>
    </div>
  );
}
