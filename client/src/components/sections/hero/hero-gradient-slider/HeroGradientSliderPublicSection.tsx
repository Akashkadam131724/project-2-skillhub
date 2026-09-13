import HeroGradientSliderUi from "./HeroGradientSliderUi";
import { resolveHeroGradientSliderSlides } from "./lib/map";
import type { HeroGradientSliderSectionProps } from "./lib/types";

export default function HeroGradientSliderPublicSection({
  id,
  items,
}: HeroGradientSliderSectionProps) {
  const slides = resolveHeroGradientSliderSlides(items, { cmsMode: false });
  if (!slides.length) return null;

  return <HeroGradientSliderUi id={id} slides={slides} />;
}
