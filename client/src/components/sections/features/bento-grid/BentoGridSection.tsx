"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import BentoGridUi from "./BentoGridUi";
import { resolveBentoGridUiItems } from "./lib/map";
import { isBentoGridPlacementShowable } from "./lib/placement";
import type { BentoGridSectionProps } from "./lib/types";

/**
 * CMS-only bento grid adapter → {@link BentoGridUi}.
 * Public pages use {@link BentoGridPublicSection}.
 */
export default function BentoGridSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "bento_grid",
  cmsMode,
  onEditField,
  id,
}: BentoGridSectionProps) {
  if (
    !isBentoGridPlacementShowable(
      { items: mappingItems, section_key, section_title, sub_title },
      cmsMode
    )
  ) {
    return null;
  }

  const items = resolveBentoGridUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <BentoGridUi
      id={id}
      preview
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
