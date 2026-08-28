"use client";

import HeroAsymmetricUi from "./HeroAsymmetricUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroAsymmetricSectionProps } from "./lib/types";

/** CMS-only hero_asymmetric adapter → {@link HeroAsymmetricUi}. */
export default function HeroAsymmetricSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
  id,
}: HeroAsymmetricSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    buttons,
    button_title,
    target_url,
    onEditField,
    onFormOpen,
  };

  if (!isHeroPlacementShowable("hero_asymmetric", props, true)) {
    return null;
  }

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    titleClassName:
      "section-theme-heading m-0 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl",
    subtitleClassName:
      "mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300",
    bodyClassName:
      "mt-3 max-w-xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400",
  });

  return (
    <HeroAsymmetricUi
      id={id}
      {...slots}
      footer={heroLayoutCmsFooter(props, "mt-0 flex-col items-stretch", {
        inverted: true,
      })}
    />
  );
}
