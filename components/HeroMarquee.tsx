import { assetPath } from "@/lib/assetPath";

type HeroMarqueeProps = {
  src: string;
  direction: "left" | "right";
  className?: string;
};

export function HeroMarquee({ src, direction, className = "" }: HeroMarqueeProps) {
  const imageSrc = assetPath(src);

  return (
    <div className={`hero-marquee hero-marquee-${direction} ${className}`} aria-hidden="true">
      <div className="hero-marquee-track">
        <span className="hero-marquee-segment" style={{ backgroundImage: `url("${imageSrc}")` }} />
        <span className="hero-marquee-segment" style={{ backgroundImage: `url("${imageSrc}")` }} />
      </div>
    </div>
  );
}
