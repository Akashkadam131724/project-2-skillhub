"use client";

import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import {
  resolveHeroImageUrl,
} from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import { mediaAlt } from "@/lib/utils/media-alt";
import EditorialBannerUi from "./EditorialBannerUi";
import type { EditorialBannerSectionProps } from "./lib/types";

/** CMS-only editorial_banner adapter → {@link EditorialBannerUi}. */
export default function EditorialBannerSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
  id,
}: EditorialBannerSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("editorial_banner", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    inverted: true,
    titleClassName:
      "m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]",
    subtitleClassName:
      "mt-5 mb-0 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl",
    bodyClassName: "mt-4 max-w-xl text-[15px] leading-relaxed text-white/70",
  });

  return (
    <EditorialBannerUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Editorial banner")}
      {...slots}
      footer={heroLayoutCmsFooter(props, "mt-8", { inverted: true })}
    />
  );
}
