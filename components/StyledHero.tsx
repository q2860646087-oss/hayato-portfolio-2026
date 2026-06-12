import { ManagedImage } from "@/components/ManagedImage";
import { Reveal } from "@/components/Reveal";
import { HeroMarquee } from "@/components/HeroMarquee";
import { siteConfig } from "@/config/site";

export function StyledHero() {
  const hero = siteConfig.hero;
  const heroTextLayers = [
    { key: "top-left", src: hero.textLayers.topLeft, className: "hero-mobile-text-top-left" },
    { key: "top-right", src: hero.textLayers.topRight, className: "hero-mobile-text-top-right" },
    { key: "bottom-left", src: hero.textLayers.bottomLeft, className: "hero-mobile-text-bottom-left" },
    { key: "bottom-right", src: hero.textLayers.bottomRight, className: "hero-mobile-text-bottom-right" },
  ] as const;

  return (
    <section id="cover" className="page-shell styled-hero hero-png-section">
      <div className="hero-atmosphere-layer" aria-hidden="true" />
      <HeroMarquee src={hero.marquee.top} direction="left" className="hero-marquee-top" />
      <HeroMarquee
        src={hero.marquee.bottom}
        direction="right"
        className="hero-marquee-bottom"
      />
      <div className="hero-mobile-text-layers" aria-hidden="true">
        {heroTextLayers.map((layer) => (
          <span
            key={layer.key}
            className={`hero-mobile-text-layer ${layer.className}`}
            style={{ backgroundImage: `url("${layer.src}")` }}
          />
        ))}
      </div>
      <Reveal className="hero-png-stage">
        <ManagedImage
          src={hero.mainImage}
          alt={hero.alt}
          placeholder="HERO PNG PLACEHOLDER"
          fit="contain"
          priority
          className="hero-png-frame"
          imageClassName="hero-png-image"
          placeholderClassName="hero-png-placeholder"
        />
      </Reveal>
    </section>
  );
}
