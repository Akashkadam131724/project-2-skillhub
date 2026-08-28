"use client";

import HeroGradientSliderUi from "./HeroGradientSliderUi";
import { HERO_GRADIENT_SLIDER_STATIC_SLIDES } from "./lib/static-demo";

export default function HeroGradientSliderStatic({
  id = "hero-gradient-slider-static",
}: {
  id?: string;
}) {
  return (
    <HeroGradientSliderUi
      id={id}
      slides={HERO_GRADIENT_SLIDER_STATIC_SLIDES}
      autoplayMs={12000}
    />
  );
}
