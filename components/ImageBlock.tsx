"use client";

import { ManagedImage } from "./ManagedImage";

type ImageBlockProps = {
  src?: string;
  alt: string;
  captionZh?: string;
  captionEn?: string;
  className?: string;
  priority?: boolean;
  placeholderText?: string;
  variant?: "rounded" | "square";
  aspectClassName?: string;
};

export function ImageBlock({
  src,
  alt,
  captionZh,
  captionEn,
  className = "",
  priority = false,
  placeholderText,
  variant = "rounded",
  aspectClassName = "aspect-[4/3]",
}: ImageBlockProps) {
  const label = placeholderText ?? captionEn ?? captionZh ?? alt;
  const frameShapeClass = variant === "square" ? "image-frame-square" : "";
  const imageShapeClass = variant === "square" ? "" : "rounded-[var(--radius)]";

  return (
    <figure className={`image-frame ${frameShapeClass} ${className}`}>
      <div className={`image-placeholder ${aspectClassName} overflow-hidden ${imageShapeClass}`}>
        <ManagedImage
          src={src}
          alt={alt}
          label={label}
          placeholder={label}
          priority={priority}
          fit="cover"
          placeholderClassName="image-managed-placeholder"
        />
      </div>
      {captionZh || captionEn ? (
        <figcaption className="px-5 py-4">
          {captionZh ? <p className="text-sm font-semibold">{captionZh}</p> : null}
          {captionEn ? (
            <p className="mt-1 font-en text-xs uppercase tracking-[0.12em] text-muted">{captionEn}</p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
