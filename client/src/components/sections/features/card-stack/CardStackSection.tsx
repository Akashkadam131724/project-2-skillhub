"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import CardStackUi from "./CardStackUi";
import { resolveCardStackUiItems } from "./lib/map";
import { isCardStackPlacementShowable } from "./lib/placement";
import type { CardStackSectionProps } from "./lib/types";

/**
 * CMS-only card stack adapter → {@link CardStackUi}.
 * Public pages use {@link CardStackPublicSection}.
 */
export default function CardStackSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "card_stack",
  cmsMode,
  onEditField,
  id,
}: CardStackSectionProps) {
  if (
    !isCardStackPlacementShowable(
      { items: mappingItems, section_key, section_title, sub_title },
      cmsMode
    )
  ) {
    return null;
  }

  const items = resolveCardStackUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <CardStackUi
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
