"use client";

import { useState, useRef, useEffect } from "react";
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

// ── 动效时长 ────────────────────────────────────────
const MARQUEE_LOOP_DURATION = 46;      // 秒/完整循环（比 52 快约 12%）
const MARQUEE_ENTER_DURATION = 1.1;    // 出现动画时长
const MARQUEE_EXIT_DURATION = 0.9;     // 消失动画时长

const DOUBLE_COUNT = CARDS_DATA.length * 2;

function Card({
  data,
  flipped,
  highlighted,
  onPointerEnter,
  onPointerLeave,
  style,
}: {
  data: (typeof CARDS_DATA)[0];
  flipped: boolean;
  highlighted: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        aspectRatio: "558 / 697",
        perspective: "800px",
        cursor: "default",
        borderRadius: 12,
        boxShadow: highlighted
          ? "0 0 0 1px rgba(238, 190, 64, 0.48), 0 0 18px rgba(255, 210, 90, 0.34), 0 10px 26px rgba(115, 84, 22, 0.16)"
          : "0 0 0 1px rgba(238, 190, 64, 0), 0 0 0 rgba(255, 210, 90, 0), 0 0 0 rgba(115, 84, 22, 0)",
        transition: "box-shadow 260ms ease",
        ...style,
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
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
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const appearTweenRef = useRef<gsap.core.Tween | null>(null);
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
      const MARQUEE_TOP_VIEWPORT_RATIO = 0.64;
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

  // ── GSAP 跑马灯动画（替代 RAF） ──────────────────────
  // visible=true 后自动 play，不再等 hover 事件
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
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    // 半宽 = 一组卡片的总宽度（用于无缝循环）
    const halfWidth = CARDS_DATA.length * (CARD_WIDTH + MARQUEE_GAP);

    try {
      // 销毁旧 tween
      tweenRef.current?.kill();

      // 初始位置设到 -halfWidth（一组卡片的末尾）
      gsap.set(track, { x: -halfWidth });

      // 创建循环 tweener：从 -halfWidth 到 0（向右移动）
      tweenRef.current = gsap.to(track, {
        x: 0,
        duration: MARQUEE_LOOP_DURATION,
        ease: "none",
        repeat: -1,
        // 到达一半时重置（无缝循环）
        modifiers: {
          x: (x: string) => {
            const val = parseFloat(x);
            if (val >= 0) {
              return `${val % halfWidth}px`;
            }
            return x;
          },
        },
      });

      // 立刻播放
      tweenRef.current.play(0);
    } catch (error) {
      console.error("[marquee gsap animation init failed]", error);
    }

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

  // ── 容器进出场动画（GSAP） ─────────────────────────
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    if (visible && !shouldRender) {
      // visible=true：先渲染，再播放入场
      setShouldRender(true);
      try {
        appearTweenRef.current?.kill();
        appearTweenRef.current = null;
        // 先重置到出场终态（防止第二次 visible=true 时 gsap.from 读到错误的中间态）
        gsap.set(el, {
          opacity: 0,
          y: 18,
          scale: 0.985,
          forceCSS: true,
        });
        appearTweenRef.current = gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: MARQUEE_ENTER_DURATION,
          ease: "power3.out",
          onComplete: () => {
            appearTweenRef.current = null;
          },
          onInterrupt: () => {
            appearTweenRef.current = null;
          },
        });
      } catch (error) {
        console.error("[marquee appear animation failed]", error);
        setShouldRender(false);
      }
      return;
    }

    if (!visible && shouldRender) {
      // visible=false：先播放出场动画，完成后隐藏
      try {
        appearTweenRef.current?.kill();
        appearTweenRef.current = null;
        appearTweenRef.current = gsap.to(el, {
          opacity: 0,
          y: 18,
          scale: 0.985,
          duration: MARQUEE_EXIT_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            setShouldRender(false);
            appearTweenRef.current = null;
          },
          onInterrupt: () => {
            appearTweenRef.current = null;
          },
        });
      } catch (error) {
        console.error("[marquee exit animation failed]", error);
        setShouldRender(false);
      }
      return;
    }
  }, [visible, shouldRender]);

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
        margin: shouldRender ? "8px auto 88px" : "0 auto",
        maxHeight: shouldRender ? 360 : 0,
        overflow: "hidden",
        position: "relative",
        pointerEvents: shouldRender ? "auto" : "none",
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
        {doubledCards.map((card, i) => {
          const cardKey = `${card.id}-${i}`;
          const isHovered = hoveredCardKey === cardKey;

          return (
            <div
              key={cardKey}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ flexShrink: 0 }}
            >
              <Card
                data={card}
                flipped={isHovered}
                highlighted={isHovered}
                onPointerEnter={() => setHoveredCardKey(cardKey)}
                onPointerLeave={() => {
                  setHoveredCardKey((current) => (current === cardKey ? null : current));
                }}
                style={{ width: CARD_WIDTH }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
