"use client";

import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import { mediaAlt } from "@/lib/utils/media-alt";
import OrbitHeroUi from "./OrbitHeroUi";
import type { OrbitHeroSectionProps } from "./lib/types";

/** CMS-only orbit_hero adapter → {@link OrbitHeroUi}. */
export default function OrbitHeroSection({
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
}: OrbitHeroSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("orbit_hero", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const badge = data?.label || data?.eyebrow || "";

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    data,
    onEditField,
    titleClassName:
      "section-theme-heading m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight",
    subtitleClassName:
      "section-theme-muted mt-5 mb-0 max-w-2xl text-base leading-relaxed sm:text-lg",
    bodyClassName: "section-theme-muted mt-4 max-w-xl text-sm",
  });

  return (
    <OrbitHeroUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Product preview")}
      badge={badge || undefined}
      {...slots}
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="mt-8 flex flex-col items-center"
          buttonsClassName="flex flex-wrap items-center justify-center gap-3"
        />
      }
    />
  );
}
