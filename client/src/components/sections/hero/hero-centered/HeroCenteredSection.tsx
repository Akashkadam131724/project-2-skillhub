"use client";

import HeroCenteredUi from "./HeroCenteredUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroCenteredSectionProps } from "./lib/types";

/** CMS-only hero_centered adapter → {@link HeroCenteredUi}. */
export default function HeroCenteredSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
  id,
}: HeroCenteredSectionProps) {
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

  if (!isHeroPlacementShowable("hero_centered", props, true)) {
    return null;
  }

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    titleClassName:
      "section-theme-heading m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl",
    subtitleClassName:
      "max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300",
    bodyClassName:
      "max-w-xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400",
  });

  return (
    <HeroCenteredUi
      id={id}
      {...slots}
      footer={heroLayoutCmsFooter(props, "mt-8 justify-center")}
    />
  );
}
