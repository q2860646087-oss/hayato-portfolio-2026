"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

// ── 路径前缀（GitHub Pages basePath） ──────────────────
const ASSET_BASE_PATH = typeof process !== "undefined" && process.env.NEXT_PUBLIC_ASSET_BASE_PATH
  ? process.env.NEXT_PUBLIC_ASSET_BASE_PATH
  : "";

function withAssetBasePath(path: string) {
  if (!path.startsWith("/")) return `${ASSET_BASE_PATH}/${path}`;
  return `${ASSET_BASE_PATH}${path}`;
}

// ── 线上调试日志（验证 basePath 拼接是否正确） ──────────
const DEBUG_MARQUEE_IMAGE_PATHS = true;

// ── 卡片数据：真实衣服样机图片 ──────────────────
const CARDS_DATA = [
  { id: 1, frontSrc: "/images/abczoo/marquee-cards/front-01.webp", backSrc: "/images/abczoo/marquee-cards/back-01.webp" },
  { id: 2, frontSrc: "/images/abczoo/marquee-cards/front-02.webp", backSrc: "/images/abczoo/marquee-cards/back-02.webp" },
  { id: 3, frontSrc: "/images/abczoo/marquee-cards/front-03.webp", backSrc: "/images/abczoo/marquee-cards/back-03.webp" },
  { id: 4, frontSrc: "/images/abczoo/marquee-cards/front-04.webp", backSrc: "/images/abczoo/marquee-cards/back-04.webp" },
  { id: 5, frontSrc: "/images/abczoo/marquee-cards/front-05.webp", backSrc: "/images/abczoo/marquee-cards/back-05.webp" },
  { id: 6, frontSrc: "/images/abczoo/marquee-cards/front-06.webp", backSrc: "/images/abczoo/marquee-cards/back-06.webp" },
  { id: 7, frontSrc: "/images/abczoo/marquee-cards/front-07.webp", backSrc: "/images/abczoo/marquee-cards/back-07.webp" },
  { id: 8, frontSrc: "/images/abczoo/marquee-cards/front-08.webp", backSrc: "/images/abczoo/marquee-cards/back-08.webp" },
  { id: 9, frontSrc: "/images/abczoo/marquee-cards/front-09.webp", backSrc: "/images/abczoo/marquee-cards/back-09.webp" },
  { id: 10, frontSrc: "/images/abczoo/marquee-cards/front-10.webp", backSrc: "/images/abczoo/marquee-cards/back-10.webp" },
];

// ── 尺寸：等比放大 10% ────────────────────────────
const CARD_WIDTH = 187;   // 170 × 1.1
const MARQUEE_GAP = 22;   // 20 × 1.1
const MARQUEE_SPEED = 10; // 秒/完整循环

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
            src={withAssetBasePath(data.frontSrc)}
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
            src={withAssetBasePath(data.backSrc)}
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
  const tweenRef = useRef<gsap.core.Tween | null>(null);
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

  // ── 线上调试：验证 basePath 拼接 ──
  useEffect(() => {
    if (!visible) return;
    if (DEBUG_MARQUEE_IMAGE_PATHS) {
      console.info("[marquee image]", withAssetBasePath(CARDS_DATA[0].frontSrc));
      console.info("[marquee image]", withAssetBasePath(CARDS_DATA[0].backSrc));
    }
  }, [visible]);

  // ── 跑马灯自动定位：open=true 后滚动到跑马灯容器 ──
  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const scheduleScroll = () => {
      if (cancelled) return;
      const el = marqueeRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const MARQUEE_TOP_VIEWPORT_RATIO = 0.60;
      const targetScroll = window.scrollY + rect.top - viewportH * MARQUEE_TOP_VIEWPORT_RATIO;

      window.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
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

  // ── GSAP 跑马灯动画（替代 RAF） ──────────────────────
  useEffect(() => {
    if (!visible) {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
      return;
    }

    // 检查无障碍偏好
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // 尊重用户偏好：不做动画
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    // 半宽 = 一组卡片的总宽度（用于无缝循环）
    const halfWidth = CARDS_DATA.length * (CARD_WIDTH + MARQUEE_GAP);

    // 初始偏移
    gsap.set(track, { x: 0 });

    // 创建循环 tweener
    tweenRef.current = gsap.to(track, {
      x: -halfWidth,
      duration: MARQUEE_SPEED,
      ease: "none",
      repeat: -1,
      paused: true,
      // 到达一半时重置（无缝循环）
      modifiers: {
        x: (x: string) => {
          const val = parseFloat(x);
          if (val <= -halfWidth) {
            return `${-halfWidth % halfWidth}px`;
          }
          return x;
        },
      },
    });

    tweenRef.current.pause();

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [visible]);

  // ── 控制播放/暂停 ──────────────────────────────────
  useEffect(() => {
    if (!tweenRef.current) return;
    if (isPaused) {
      tweenRef.current.pause();
    } else {
      tweenRef.current.resume();
    }
  }, [isPaused]);

  // ── 卡片 fade 效果（边缘淡出） ─────────────────────
  useEffect(() => {
    if (!visible) return;

    let rafId: number;
    const fadeEdges = () => {
      const viewportRect = marqueeRef.current?.getBoundingClientRect();
      if (!viewportRect) {
        rafId = requestAnimationFrame(fadeEdges);
        return;
      }
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
      rafId = requestAnimationFrame(fadeEdges);
    };

    rafId = requestAnimationFrame(fadeEdges);
    return () => cancelAnimationFrame(rafId);
  }, [visible]);

  // 双倍卡片用于无缝循环
  const doubledCards = [...CARDS_DATA, ...CARDS_DATA];

  return (
    <div
      ref={marqueeRef}
      style={{
        width: "min(94vw, 1400px)",
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
