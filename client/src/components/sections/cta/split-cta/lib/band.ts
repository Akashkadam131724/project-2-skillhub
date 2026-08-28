import type { CSSProperties } from "react";
import { bannerBgStyle } from "@/lib/theme/banner-bg";
import type { SplitCtaImageSide } from "./types";

/** Theme band — ink → brand (inherits page / site theme CSS vars). */
export const SPLIT_CTA_THEME_BAND_CLASS =
  "bg-[linear-gradient(to_right,var(--ink),var(--brand))] text-white";

export function resolveSplitCtaBandStyle(
  sectionBgColor?: string,
  legacyBgColor?: string
): CSSProperties | null {
  const raw = String(sectionBgColor || legacyBgColor || "").trim();
  if (!raw) return null;
  return bannerBgStyle(raw) as CSSProperties;
}

export function normalizeSplitCtaImageSide(
  data?: { image_side?: string }
): SplitCtaImageSide {
  const raw = String(data?.image_side || "right").toLowerCase();
  return raw === "left" ? "left" : "right";
}
