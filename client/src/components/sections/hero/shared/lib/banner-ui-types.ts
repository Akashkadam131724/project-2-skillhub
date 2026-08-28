import type { ReactNode } from "react";

/** Shared presentation props for full-bleed hero banners. */
export type HeroBannerUiProps = {
  id?: string;
  imageUrl?: string;
  imageAlt?: string;
  eyebrow?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  bodySlot?: ReactNode;
  footer?: ReactNode;
  /** LCP candidate — defaults high fetch priority for hero band images. */
  priority?: boolean;
};
