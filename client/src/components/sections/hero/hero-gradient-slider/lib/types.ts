import type { HeroContentSectionProps } from "@/components/sections/hero/shared/lib/types";

export type HeroGradientSliderStat = {
  id: string;
  value: string;
  label: string;
  icon?: string;
};

export type HeroGradientSliderSlide = {
  id: string;
  title: string;
  /** HTML body copy */
  body?: string;
  /** Right-panel image URL */
  sideImageUrl?: string;
  /** CMS-shaped buttons — including optional Watch video */
  buttons?: unknown[];
  /** Optional trust stats for this slide */
  stats?: HeroGradientSliderStat[];
};

export type HeroGradientSliderUiProps = {
  id?: string;
  slides: HeroGradientSliderSlide[];
  /** Autoplay interval in ms; 0 disables */
  autoplayMs?: number;
  cmsMode?: boolean;
  section_key?: string;
  onEditField?: (field: string, extra?: unknown) => void;
};

export type HeroGradientSliderSectionProps = HeroContentSectionProps;
