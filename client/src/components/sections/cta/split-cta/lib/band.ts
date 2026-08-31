import type { CSSProperties } from "react";
import { bannerBgStyle } from "@/lib/theme/banner-bg";
import type { SplitCtaImageSide } from "./types";

/** Theme band — ink → brand (inherits page / site theme CSS vars). */
export const SPLIT_CTA_THEME_BAND_CLASS =
  "bg-[linear-gradient(to_right,var(--ink),var(--brand))] text-white";

export const SPLIT_CTA_TITLE_CLASS =
  "m-0 mb-3 max-w-xl text-[22px] leading-[30px] font-semibold text-white md:mb-3 md:text-xl md:leading-[26px] lg:mb-[18px] lg:text-[26px] lg:leading-9 xl:text-[32px] xl:leading-[42px]";

export const SPLIT_CTA_SUBTITLE_CLASS =
  "m-0 mb-6 max-w-xl text-base leading-6 font-normal text-white/90 md:mb-[26px] md:text-sm md:leading-[18px] lg:mb-[34px] lg:text-sm lg:leading-[22px] xl:text-base xl:leading-6";

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
