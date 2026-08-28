"use client";

import HeroSplitUi from "./HeroSplitUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
  HeroImageCms,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { hasMediaUrl } from "@/components/sections/hero/shared/hero-fields";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroSplitSectionProps } from "./lib/types";

/** CMS-only hero_split adapter → {@link HeroSplitUi}. */
export default function HeroSplitSection({
  section_title,
  sub_title,
  data,
  section_img_url,
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
  id,
}: HeroSplitSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    section_img_url,
    buttons,
    button_title,
    target_url,
    onEditField,
    onFormOpen,
  };

  if (!isHeroPlacementShowable("hero_split", props, true)) {
    return null;
  }

  const hasImage = hasMediaUrl(section_img_url);
  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    titleClassName:
      "section-theme-heading m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl",
    subtitleClassName:
      "text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300",
    bodyClassName:
      "text-[15px] leading-relaxed text-slate-500 dark:text-slate-400",
  });

  return (
    <HeroSplitUi
      id={id}
      {...slots}
      imageUrl={resolveHeroImageUrl(section_img_url, data)}
      imageSlot={
        hasImage ? (
          <HeroImageCms
            section_img_url={section_img_url}
            onEditField={onEditField}
            title={section_title}
            className="w-full"
            imgClassName="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        ) : undefined
      }
      imageAddSlot={
        !hasImage ? (
          <HeroImageCms
            section_img_url={section_img_url}
            onEditField={onEditField}
          />
        ) : null
      }
      footer={heroLayoutCmsFooter(props, "mt-2")}
    />
  );
}
