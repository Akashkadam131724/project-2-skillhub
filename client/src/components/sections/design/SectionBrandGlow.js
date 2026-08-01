"use client";

import {
  SECTION_BRAND_GLOW_STYLE,
  sectionBrandGlowClassName,
} from "@/lib/sections/section-design-system";

export default function SectionBrandGlow() {
  return (
    <div
      aria-hidden
      className={sectionBrandGlowClassName()}
      style={SECTION_BRAND_GLOW_STYLE}
    />
  );
}
