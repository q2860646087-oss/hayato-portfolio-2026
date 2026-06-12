"use client";

import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { ManagedImage } from "@/components/ManagedImage";
import type {
  FreeCanvasBoxElement,
  FreeCanvasElement,
  FreeCanvasImageElement,
  FreeCanvasPage,
  FreeCanvasTextElement,
} from "@/types/freeCanvas";

type FreeCanvasProps = {
  page: FreeCanvasPage;
  className?: string;
};

export function FreeCanvas({ page, className = "" }: FreeCanvasProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const updateScale = () => {
      setScale(shell.clientWidth / page.canvasWidth);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(shell);

    return () => resizeObserver.disconnect();
  }, [page.canvasWidth]);

  return (
    <section className={`free-canvas-section ${className}`}>
      <div
        ref={shellRef}
        className="free-canvas-shell"
        style={{ maxWidth: `${page.canvasWidth}px` }}
      >
        <div
          className="free-canvas-viewport"
          style={{ aspectRatio: `${page.canvasWidth} / ${page.canvasHeight}` }}
        >
          <div
            className="free-canvas-stage"
            style={{
              width: `${page.canvasWidth}px`,
              height: `${page.canvasHeight}px`,
              transform: `scale(${scale})`,
            }}
          >
            {page.elements.map((element) => (
              <FreeCanvasElementView key={element.id} element={element} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FreeCanvasElementView({ element }: { element: FreeCanvasElement }) {
  const style = getElementStyle(element);

  if (element.type === "image") {
    return <FreeCanvasImage element={element} style={style} />;
  }

  if (element.type === "box") {
    return <FreeCanvasBox element={element} style={style} />;
  }

  return <FreeCanvasText element={element} style={style} />;
}

function FreeCanvasImage({ element, style }: { element: FreeCanvasImageElement; style: CSSProperties }) {
  return (
    <div
      className={`free-canvas-element free-canvas-image ${element.className ?? ""}`}
      style={{
        ...style,
        borderRadius: element.borderRadius,
      }}
    >
      <ManagedImage
        src={element.src}
        alt={element.alt}
        fit={element.fit ?? "cover"}
        placeholder={element.alt}
        className="h-full w-full"
        imageClassName="h-full w-full"
      />
    </div>
  );
}

function FreeCanvasText({ element, style }: { element: FreeCanvasTextElement; style: CSSProperties }) {
  return (
    <div
      className={`free-canvas-element free-canvas-text ${element.className ?? ""}`}
      style={{
        ...style,
        color: element.color,
        fontFamily: getFontFamily(element.fontFamily),
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight,
        lineHeight: `${element.lineHeight}px`,
        letterSpacing: element.letterSpacing,
        textAlign: element.align,
        textTransform: element.uppercase ? "uppercase" : undefined,
      }}
    >
      {element.text}
    </div>
  );
}

function FreeCanvasBox({ element, style }: { element: FreeCanvasBoxElement; style: CSSProperties }) {
  return (
    <div
      className={`free-canvas-element free-canvas-box ${element.className ?? ""}`}
      style={{
        ...style,
        background: element.background,
        borderColor: element.borderColor,
        borderRadius: element.borderRadius,
        borderStyle: element.borderWidth ? "solid" : undefined,
        borderWidth: element.borderWidth,
      }}
    />
  );
}

function getElementStyle(element: FreeCanvasElement): CSSProperties {
  return {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.w}px`,
    height: `${element.h}px`,
    zIndex: element.zIndex,
    opacity: element.opacity,
    transform: `rotate(${element.rotate}deg)`,
  };
}

function getFontFamily(fontFamily: FreeCanvasTextElement["fontFamily"]) {
  if (fontFamily === "heading") {
    return "var(--font-heading)";
  }

  if (fontFamily === "en") {
    return "var(--font-en)";
  }

  return "var(--font-body)";
}
