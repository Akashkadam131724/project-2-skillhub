export type HeroGradientSliderStat = {
  id: string;
  value: string;
  label: string;
};

export type HeroGradientSliderSlide = {
  id: string;
  title: string;
  /** HTML body copy (legacy: short_description) */
  body?: string;
  /** Right-panel image URL (legacy: image_url) */
  sideImageUrl?: string;
  /** Optional YouTube / video URL — shows play control when set */
  videoUrl?: string;
  /** Section background (gradient or color) — falls back to default band */
  bgColor?: string;
  /** Show trust stats on this slide (default: first slide only in Ui) */
  showStats?: boolean;
  /** CMS-shaped buttons — primary + secondary CTA row */
  buttons?: unknown[];
};

export type HeroGradientSliderUiProps = {
  id?: string;
  slides: HeroGradientSliderSlide[];
  /** Autoplay interval in ms; 0 disables */
  autoplayMs?: number;
};
