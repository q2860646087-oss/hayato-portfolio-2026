"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── 卡片数据（占位，后续替换真实图片） ──────────────────
const CARDS_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  frontLabel: `CARD 0${i + 1}`,
  frontSub: "Apparel Mockup",
  backLabel: `CARD 0${i + 1}`,
  backSub: "Model Wearing",
}));

const CARD_WIDTH = 170;
const MARQUEE_GAP = 20;
const MARQUEE_SPEED = 40; // 秒/完整循环
const DOUBLE_COUNT = CARDS_DATA.length * 2;

function Card({
  data,
  flipped,
  onFlip,
  style,
}: {
  data: (typeof CARDS_DATA)[0];
  flipped: boolean;
  onFlip: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        aspectRatio: "450 / 720",
        perspective: "800px",
        cursor: "pointer",
        ...style,
      }}
      onClick={onFlip}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* 正面 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 12,
            background: "#FFFFFF",
            border: "1px solid rgba(21, 59, 111, 0.12)",
            boxShadow: "0 4px 20px rgba(21, 59, 111, 0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#F6CF58",
              marginBottom: 16,
            }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#153B6F",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            {data.frontLabel}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#153B6F",
              opacity: 0.5,
              letterSpacing: "0.06em",
            }}
          >
            {data.frontSub}
          </div>
        </div>

        {/* 背面 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 12,
            background: "#FFF9F1",
            border: "1px solid rgba(21, 59, 111, 0.12)",
            boxShadow: "0 4px 20px rgba(21, 59, 111, 0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#153B6F",
              marginBottom: 16,
            }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#153B6F",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            {data.backLabel}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#153B6F",
              opacity: 0.5,
              letterSpacing: "0.06em",
            }}
          >
            {data.backSub}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PackagingCardMarquee({ visible = false }: { visible?: boolean }) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);

  const toggleFlip = useCallback((id: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const halfWidth = CARDS_DATA.length * (CARD_WIDTH + MARQUEE_GAP);

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && visible) {
        offsetRef.current -= dt * MARQUEE_SPEED * 30;
        if (offsetRef.current <= -halfWidth) {
          offsetRef.current += halfWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, visible]);

  // 双倍卡片用于无缝循环
  const doubledCards = [...CARDS_DATA, ...CARDS_DATA];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "16px auto 80px",
        overflow: "hidden",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 360ms ease, transform 360ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: MARQUEE_GAP,
          width: "max-content",
          willChange: "transform",
        }}
      >
        {doubledCards.map((card, i) => (
          <Card
            key={`${card.id}-${i}`}
            data={card}
            flipped={flippedCards.has(card.id)}
            onFlip={() => toggleFlip(card.id)}
            style={{ flexShrink: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
