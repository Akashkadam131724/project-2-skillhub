"use client";

import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import { mediaAlt } from "@/lib/utils/media-alt";
import StatementBandUi from "./StatementBandUi";
import type { StatementBandSectionProps } from "./lib/types";

/** CMS-only statement_band adapter → {@link StatementBandUi}. */
export default function StatementBandSection({
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
}: StatementBandSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("statement_band", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const eyebrow = data?.eyebrow || data?.label || "";

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    inverted: true,
    titleClassName:
      "m-0 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-tight text-white",
    subtitleClassName:
      "mt-8 mb-0 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl",
    bodyClassName: "mt-5 max-w-xl text-[15px] leading-relaxed text-white/60",
  });

  return (
    <StatementBandUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Statement background")}
      eyebrow={eyebrow || undefined}
      {...slots}
      footer={heroLayoutCmsFooter(props, "mt-10", { inverted: true })}
    />
  );
}
