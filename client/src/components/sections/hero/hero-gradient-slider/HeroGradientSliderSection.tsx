"use client";

import HeroGradientSliderUi from "./HeroGradientSliderUi";
import { resolveHeroGradientSliderSlides } from "./lib/map";
import type { HeroGradientSliderSectionProps } from "./lib/types";

/** CMS live-edit adapter → {@link HeroGradientSliderUi}. */
export default function HeroGradientSliderSection({
  id,
  items,
  onEditField,
}: HeroGradientSliderSectionProps) {
  const slides = resolveHeroGradientSliderSlides(items, { cmsMode: true });

  return (
    <HeroGradientSliderUi
      id={id}
      slides={slides}
      cmsMode
      onEditField={onEditField}
    />
  );
}
