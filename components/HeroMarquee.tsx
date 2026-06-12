import { assetPath } from "@/lib/assetPath";

type HeroMarqueeProps = {
  src: string;
  direction: "left" | "right";
  className?: string;
};

export function HeroMarquee({ src, direction, className = "" }: HeroMarqueeProps) {
  const imageSrc = assetPath(src);

  return (
    <div
      className={`hero-marquee hero-marquee-${direction} ${className}`}
      style={{ backgroundImage: `url("${imageSrc}")` }}
      aria-hidden="true"
    />
  );
}
