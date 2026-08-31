"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import PartnersMarqueeUi from "./PartnersMarqueeUi";
import { resolvePartnerLogoUiItems } from "./lib/map";
import { isPartnersMarqueePlacementShowable } from "./lib/placement";
import type { PartnersMarqueeSectionProps } from "./lib/types";

/** CMS-only partners marquee adapter → {@link PartnersMarqueeUi}. */
export default function PartnersMarqueeSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "partners_marquee",
  onEditField,
  id,
}: PartnersMarqueeSectionProps) {
  const items = resolvePartnerLogoUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isPartnersMarqueePlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <PartnersMarqueeUi
      id={id}
      preview
      eyebrow="Ecosystem"
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
      })}

    />
  );
}
