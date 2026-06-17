"use client";

import { useEffect, useState } from "react";

type ManagedImageProps = {
  src?: string;
  alt: string;
  label?: string;
  placeholder?: string;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  shape?: "rounded" | "square" | "none";
  fit?: "cover" | "contain";
  priority?: boolean;
};

export function ManagedImage({
  src,
  alt,
  label,
  placeholder,
  className = "",
  imageClassName = "",
  placeholderClassName = "",
  shape = "none",
  fit = "cover",
  priority = false,
}: ManagedImageProps) {
  const [hasImage, setHasImage] = useState(Boolean(src));
  const shapeClass = shape === "rounded" ? "rounded-[var(--radius)]" : "";
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const placeholderText = placeholder ?? label ?? "作品内容整理中";

  useEffect(() => {
    setHasImage(Boolean(src));
  }, [src]);

  return (
    <div className={`managed-image grid h-full w-full place-items-center overflow-hidden ${shapeClass} ${className}`}>
      {src && hasImage ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={`h-full w-full ${fitClass} ${imageClassName}`}
          onError={() => setHasImage(false)}
        />
      ) : (
        <div className={`grid h-full w-full place-items-center px-8 text-center ${placeholderClassName}`}>
          <p className="font-en text-xs uppercase tracking-[0.18em] text-muted">{placeholderText}</p>
        </div>
      )}
    </div>
  );
}
