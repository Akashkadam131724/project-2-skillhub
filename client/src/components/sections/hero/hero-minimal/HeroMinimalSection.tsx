"use client";

import HeroMinimalUi from "./HeroMinimalUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroMinimalSectionProps } from "./lib/types";

/** CMS-only hero_minimal adapter → {@link HeroMinimalUi}. */
export default function HeroMinimalSection({
  section_title,
  sub_title,
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
  id,
}: HeroMinimalSectionProps) {
  const props = {
    section_title,
    sub_title,
    buttons,
    button_title,
    target_url,
    onEditField,
    onFormOpen,
  };

  if (!isHeroPlacementShowable("hero_minimal", props, true)) {
    return null;
  }

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    onEditField,
    includeBody: false,
    titleClassName:
      "section-theme-heading m-0 text-2xl leading-snug font-bold tracking-tight sm:text-3xl",
    subtitleClassName: "section-theme-muted text-[15px] leading-relaxed",
  });

  return (
    <HeroMinimalUi
      id={id}
      {...slots}
      footer={heroLayoutCmsFooter(props, "mt-6")}
    />
  );
}
