"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── 卡片数据：真实衣服样机图片 ──────────────────
const CARDS_DATA = [
  { id: 1, frontSrc: "/images/abczoo/跑马灯卡/正面 (1).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (1).webp" },
  { id: 2, frontSrc: "/images/abczoo/跑马灯卡/正面 (2).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (2).webp" },
  { id: 3, frontSrc: "/images/abczoo/跑马灯卡/正面 (3).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (3).webp" },
  { id: 4, frontSrc: "/images/abczoo/跑马灯卡/正面 (4).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (4).webp" },
  { id: 5, frontSrc: "/images/abczoo/跑马灯卡/正面 (5).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (5).webp" },
  { id: 6, frontSrc: "/images/abczoo/跑马灯卡/正面 (6).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (6).webp" },
  { id: 7, frontSrc: "/images/abczoo/跑马灯卡/正面 (7).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (7).webp" },
  { id: 8, frontSrc: "/images/abczoo/跑马灯卡/正面 (8).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (8).webp" },
  { id: 9, frontSrc: "/images/abczoo/跑马灯卡/正面 (9).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (9).webp" },
  { id: 10, frontSrc: "/images/abczoo/跑马灯卡/正面 (10).webp", backSrc: "/images/abczoo/跑马灯卡/背面 (10).webp" },
];

const CARD_WIDTH = 170;
const MARQUEE_GAP = 20;
const MARQUEE_SPEED = 10; // 秒/完整循环（进一步放慢）
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
        aspectRatio: "558 / 697",
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
            overflow: "hidden",
            background: "#FFFFFF",
          }}
        >
          <img
            src={data.frontSrc}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* 背面 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 12,
            overflow: "hidden",
            background: "#FFF9F1",
            transform: "rotateY(180deg)",
          }}
        >
          <img
            src={data.backSrc}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── 事件名（与 Box3D.tsx 保持一致） ──────────────────
const BOX3D_OPEN_EVENT = "box3d:open-change";
const BOX3D_MARQUEE_INTERACT_EVENT = "box3d:marquee-interaction";

export function PackagingCardMarquee() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleBoxOpenChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ open: boolean }>;
      setVisible(Boolean(customEvent.detail?.open));
    };

    window.addEventListener(BOX3D_OPEN_EVENT, handleBoxOpenChange);
    return () => {
      window.removeEventListener(BOX3D_OPEN_EVENT, handleBoxOpenChange);
    };
  }, []);

  // ── 跑马灯自动定位：open=true 后两帧即滚动居中，不等展开动画 ──
  useEffect(() => {
    if (!visible) return;
    const el = marqueeRef.current;
    if (!el) return;

    let cancelled = false;

    const scheduleScroll = () => {
      if (cancelled) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewportH = window.innerHeight;
      const targetScroll = window.scrollY + elCenter - viewportH / 2;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    };

    // 第 1 帧：flush layout
    const raf1 = requestAnimationFrame(() => {
      // 第 2 帧：读取新高度并滚动
      requestAnimationFrame(scheduleScroll);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
    };
  }, [visible]);

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

      // ── 根据卡片在 viewport 中的位置更新 opacity ──
      if (visible) {
        const viewportRect = marqueeRef.current?.getBoundingClientRect();
        if (viewportRect) {
          const fadeWidth = Math.min(260, viewportRect.width * 0.22);
          const refs = cardRefs.current;
          for (let i = 0; i < refs.length; i++) {
            const el = refs[i];
            if (!el) continue;
            const cardRect = el.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const leftDistance = cardCenterX - viewportRect.left;
            const rightDistance = viewportRect.right - cardCenterX;
            const edgeDistance = Math.min(leftDistance, rightDistance);
            const opacity = Math.min(1, Math.max(0, edgeDistance / fadeWidth));
            el.style.opacity = String(opacity);
          }
        }
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
      ref={marqueeRef}
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: visible ? "8px auto 88px" : "0 auto",
        maxHeight: visible ? 360 : 0,
        overflow: "hidden",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.985)",
        filter: visible ? "blur(0)" : "blur(2px)",
        transition:
          "opacity 420ms ease, " +
          "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "max-height 620ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "margin 620ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "filter 420ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={() => {
        setIsPaused(true);
        window.dispatchEvent(new CustomEvent(BOX3D_MARQUEE_INTERACT_EVENT, { detail: { active: true } }));
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        window.dispatchEvent(new CustomEvent(BOX3D_MARQUEE_INTERACT_EVENT, { detail: { active: false } }));
      }}
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
          <div
            key={`${card.id}-${i}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ flexShrink: 0 }}
          >
            <Card
              data={card}
              flipped={flippedCards.has(card.id)}
              onFlip={() => toggleFlip(card.id)}
              style={{ width: CARD_WIDTH }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
