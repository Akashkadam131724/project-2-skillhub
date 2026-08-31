"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import PillarDestinationsUi from "./PillarDestinationsUi";
import { resolvePillarDestinationsUiItems } from "./lib/map";
import { isPillarDestinationsPlacementShowable } from "./lib/placement";
import type { PillarDestinationsSectionProps } from "./lib/types";

/**
 * CMS-only pillar destinations adapter → {@link PillarDestinationsUi}.
 * Public pages use {@link PillarDestinationsPublicSection}.
 */
export default function PillarDestinationsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "pillar_destinations",
  cmsMode,
  onEditField,
  id,
}: PillarDestinationsSectionProps) {
  if (
    !isPillarDestinationsPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  const items = resolvePillarDestinationsUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <PillarDestinationsUi
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
