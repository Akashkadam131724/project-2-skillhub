"use client";

import HeroGradientSliderStatic from "./HeroGradientSliderStatic";

type HeroGradientSliderSectionProps = {
  id?: string;
};

/** CMS live-edit adapter — static preview until items/fields are configured. */
export default function HeroGradientSliderSection({
  id,
}: HeroGradientSliderSectionProps) {
  return <HeroGradientSliderStatic id={id} />;
}
