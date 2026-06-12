type HeroMarqueeProps = {
  src: string;
  direction: "left" | "right";
  className?: string;
};

export function HeroMarquee({ src, direction, className = "" }: HeroMarqueeProps) {
  return (
    <div
      className={`hero-marquee hero-marquee-${direction} ${className}`}
      style={{ backgroundImage: `url("${src}")` }}
      aria-hidden="true"
    />
  );
}
