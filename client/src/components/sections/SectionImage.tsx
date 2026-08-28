"use client";

import Image from "next/image";
import { mediaUrl } from "@/lib/api/cms-api";

export type SectionImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  quality?: number;
};

/**
 * Optimized section image — WebP/AVIF via next/image, lazy by default.
 */
export default function SectionImage({
  src,
  alt = "",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 720px",
  fill = false,
  width,
  height,
  loading,
  quality = 80,
}: SectionImageProps) {
  const resolved = src?.startsWith("http") ? src : mediaUrl(src);
  if (!resolved) return null;

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        {...(priority ? {} : { loading: loading || "lazy" })}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width || 1200}
      height={height || 900}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      {...(priority ? {} : { loading: loading || "lazy" })}
    />
  );
}
