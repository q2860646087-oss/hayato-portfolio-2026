"use client";

import { useEffect, useState } from "react";

type HeroMarqueeProps = {
  src: string;
  fallbackSrc?: string;
  direction: "left" | "right";
  className?: string;
};

export function HeroMarquee({ src, fallbackSrc, direction, className = "" }: HeroMarqueeProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasImage, setHasImage] = useState(Boolean(src));

  useEffect(() => {
    setImageSrc(src);
    setHasImage(Boolean(src));
  }, [src]);

  const handleImageError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasImage(true);
      return;
    }

    setHasImage(false);
  };

  return (
    <div className={`hero-marquee hero-marquee-${direction} ${className}`} aria-hidden="true">
      <div className="hero-marquee-track">
        {[0, 1].map((item) =>
          hasImage ? (
            <img
              key={`${imageSrc}-${item}`}
              src={imageSrc}
              alt=""
              draggable={false}
              onError={handleImageError}
            />
          ) : (
            <div key={`placeholder-${item}`} className="hero-marquee-placeholder">
              MARQUEE PNG PLACEHOLDER
            </div>
          ),
        )}
      </div>
    </div>
  );
}
