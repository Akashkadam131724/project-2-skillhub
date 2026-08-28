"use client";

import HeroDualCtaUi from "./HeroDualCtaUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
  HeroImageCms,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { hasMediaUrl } from "@/components/sections/hero/shared/hero-fields";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroDualCtaSectionProps } from "./lib/types";

/** CMS-only hero_dual_cta adapter → {@link HeroDualCtaUi}. */
export default function HeroDualCtaSection({
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
}: HeroDualCtaSectionProps) {
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

  if (!isHeroPlacementShowable("hero_dual_cta", props, true)) {
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
    subtitleClassName: "section-theme-muted text-base leading-relaxed",
    bodyClassName:
      "text-[15px] leading-relaxed text-slate-500 dark:text-slate-400",
  });

  return (
    <HeroDualCtaUi
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
            imgClassName="aspect-[5/4] w-full rounded-2xl object-cover shadow-lg shadow-slate-200/60 dark:shadow-none"
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
      footer={heroLayoutCmsFooter(props, "mt-3")}
    />
  );
}
