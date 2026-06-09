"use client";

import type { CSSProperties } from "react";
import styles from "./CircularText.module.css";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
  className?: string;
}

type CircularTextStyle = CSSProperties & {
  "--spin-duration": string;
  "--hover-duration": string;
  "--rotation"?: string;
};

const hoverClassMap = {
  slowDown: styles.slowDown,
  speedUp: styles.speedUp,
  pause: styles.pause,
  goBonkers: styles.goBonkers,
};

export default function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}: CircularTextProps) {
  const letters = Array.from(text);
  const letterCount = Math.max(letters.length, 1);
  const hoverDuration =
    onHover === "slowDown"
      ? spinDuration * 2
      : onHover === "goBonkers"
        ? spinDuration / 20
        : spinDuration / 4;
  const rootStyle: CircularTextStyle = {
    "--spin-duration": `${spinDuration}s`,
    "--hover-duration": `${hoverDuration}s`,
  };

  return (
    <div
      className={`${styles.circularText} ${onHover ? hoverClassMap[onHover] : ""} ${className}`}
      style={rootStyle}
      aria-label={text}
    >
      {letters.map((letter, index) => {
        const rotationDeg = (360 / letterCount) * index;
        const letterStyle: CircularTextStyle = {
          "--spin-duration": `${spinDuration}s`,
          "--hover-duration": `${hoverDuration}s`,
          "--rotation": `${rotationDeg}deg`,
        };

        return (
          <span key={`${letter}-${index}`} style={letterStyle}>
            {letter}
          </span>
        );
      })}
    </div>
  );
}
