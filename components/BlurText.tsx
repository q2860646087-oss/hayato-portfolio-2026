"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimationControls } from "motion/react";

type BlurTextProps = {
  text: string;
  delay?: number;
  animateBy?: "letters" | "words";
  direction?: "top" | "bottom";
  stepDuration?: number;
  className?: string;
  onAnimationComplete?: () => void;
};

export function BlurText({
  text,
  delay = 100,
  animateBy = "letters",
  direction = "top",
  stepDuration = 0.25,
  className = "",
  onAnimationComplete,
}: BlurTextProps) {
  const controls = useAnimationControls();
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 300ms 兜底：防止 IntersectionObserver 不触发导致文字永远消失
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setInView(true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 检测减少动画偏好
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!inView) return;

    const runAnimation = async () => {
      if (animateBy === "words") {
        const words = text.split(" ");
        await controls.start((i: number) => ({
          filter: ["blur(10px)", "blur(0px)"],
          opacity: [0, 1],
          y: direction === "top" ? [-20, 0] : [20, 0],
          transition: {
            delay: i * (delay / 1000),
            duration: stepDuration,
            ease: "easeOut",
          },
        }));
      } else {
        const letters = text.split("");
        await controls.start((i: number) => ({
          filter: ["blur(10px)", "blur(0px)"],
          opacity: [0, 1],
          y: direction === "top" ? [-20, 0] : [20, 0],
          transition: {
            delay: i * (delay / 1000),
            duration: stepDuration,
            ease: "easeOut",
          },
        }));
      }
      onAnimationComplete?.();
    };

    runAnimation();
  }, [inView, animateBy, direction, delay, stepDuration, text, controls, onAnimationComplete, prefersReducedMotion]);

  // 未挂载或减少动画偏好时直接显示文字
  if (!mounted || prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  const baseStyle = {
    display: "inline-flex" as const,
    flexWrap: "wrap" as const,
    font: "inherit",
    color: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
  } as React.CSSProperties;

  const letterStyle = {
    display: "inline-block" as const,
    willChange: "transform, filter, opacity",
    font: "inherit",
    color: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
  } as React.CSSProperties;

  if (animateBy === "words") {
    const words = text.split(" ");
    return (
      <motion.span
        ref={ref}
        className={className}
        style={baseStyle}
        initial={false}
        animate={controls}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={letterStyle}
            className="mr-1 last:mr-0"
            initial={{ filter: "blur(10px)", opacity: 0, y: direction === "top" ? -20 : 20 }}
            animate={controls}
            custom={i}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const letters = text.split("");
  return (
    <motion.span
      ref={ref}
      className={className}
      style={baseStyle}
      initial={false}
      animate={controls}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          style={letterStyle}
          initial={{ filter: "blur(10px)", opacity: 0, y: direction === "top" ? -20 : 20 }}
          animate={controls}
          custom={i}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
