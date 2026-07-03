import { ManagedImage } from "@/components/ManagedImage";
import { Reveal } from "@/components/Reveal";
import { HeroMarquee } from "@/components/HeroMarquee";
import { siteConfig } from "@/config/site";
import { assetPath } from "@/lib/assetPath";

export function StyledHero() {
  const hero = siteConfig.hero;
  const heroDeco01 = assetPath("/assets/hero/hero-deco-01.webp");
  const heroDeco02 = assetPath("/assets/hero/hero-deco-02.webp");

  const heroCornerText = [
    { key: "top-left", className: "hero-corner-text-top-left", lines: ["VISUAL DESIGNER", "& ILLUSTRATOR"] },
    { key: "top-right", className: "hero-corner-text-top-right", lines: ["SELECTED WORKS", "2022-2026"] },
    { key: "bottom-left", className: "hero-corner-text-bottom-left", lines: ["PERSONAL*", "DESIGNER*", "HAYATO*"] },
    {
      key: "bottom-right",
      className: "hero-corner-text-bottom-right",
      lines: ["GRAPHIC DESIGN", "ILLUSTRATION", "VISUAL IDENTITY"],
    },
  ] as const;

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
      <HeroMarquee src={hero.marquee.bottom} direction="right" className="hero-marquee-bottom" />

      <div className="hero-corner-text-layer" aria-hidden="true">
        {heroCornerText.map((item) => (
          <div key={item.key} className={`hero-corner-text-card ${item.className}`}>
            {item.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        ))}
      </div>

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
        <div className="hero-png-frame">
          <ManagedImage
            src={hero.mainImage}
            alt={hero.alt}
            placeholder="主视觉加载中"
            fit="contain"
            priority
            className="hero-png-base"
            imageClassName="hero-png-image"
            placeholderClassName="hero-png-placeholder"
          />

          <a
            className="hero-png-layer hero-png-layer-02 hero-box-link"
            href="#work"
            aria-label="跳转到作品页"
          >
            <img src={heroDeco02} alt="" aria-hidden="true" />
          </a>

          <img
            className="hero-png-layer hero-png-layer-01"
            src={heroDeco01}
            alt=""
            aria-hidden="true"
          />
        </div>
      </Reveal>
    </section>
  );
}
