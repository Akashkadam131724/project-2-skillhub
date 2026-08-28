"use client";

import HeroClassicUi from "./HeroClassicUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
  HeroImageCms,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { hasMediaUrl } from "@/components/sections/hero/shared/hero-fields";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroClassicSectionProps } from "./lib/types";

/** CMS-only hero_classic adapter → {@link HeroClassicUi}. */
export default function HeroClassicSection({
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
}: HeroClassicSectionProps) {
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

  if (!isHeroPlacementShowable("hero_classic", props, true)) {
    return null;
  }

  const hasImage = hasMediaUrl(section_img_url);
  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    titleClassName:
      "section-theme-heading m-0 font-[family-name:var(--font-display)] text-[2.15rem] leading-[1.06] font-semibold tracking-tight sm:text-[2.75rem] lg:text-[3.5rem]",
    subtitleClassName:
      "max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300",
    bodyClassName:
      "max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-base dark:text-slate-400",
  });

  return (
    <HeroClassicUi
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
      footer={heroLayoutCmsFooter(props, "mt-7 sm:mt-8", {
        buttonsClassName: "flex flex-wrap items-center gap-3",
      })}
    />
  );
}
