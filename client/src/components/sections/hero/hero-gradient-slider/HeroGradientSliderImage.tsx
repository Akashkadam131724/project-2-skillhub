"use client";

import { useState } from "react";

export default function HeroGradientSliderImage({
  src,
  alt = "Banner",
  className = "",
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/40 italic ${className}`}
      >
        Banner image
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
