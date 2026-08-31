"use client";

import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import { mediaAlt } from "@/lib/utils/media-alt";
import SiteBuilderHeroUi from "./SiteBuilderHeroUi";
import type { SiteBuilderHeroSectionProps } from "./lib/types";

/** CMS-only site_builder_hero adapter → {@link SiteBuilderHeroUi}. */
export default function SiteBuilderHeroSection({
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
}: SiteBuilderHeroSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("site_builder_hero", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const badge = data?.label || data?.eyebrow || "";

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    inverted: true,
    titleClassName:
      "m-0 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8.8rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-white",
    subtitleClassName:
      "mt-7 mb-0 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl",
    bodyClassName: "mt-4 max-w-lg text-sm leading-relaxed text-white/55",
  });

  return (
    <SiteBuilderHeroUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Site preview")}
      badge={badge || undefined}
      {...slots}
      footer={heroLayoutCmsFooter(props, "mt-9", { inverted: true })}
    />
  );
}
