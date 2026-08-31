"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import FeatureSpotlightUi from "./FeatureSpotlightUi";
import { resolveFeatureSpotlightUiItems } from "./lib/map";
import { isFeatureSpotlightPlacementShowable } from "./lib/placement";
import type { FeatureSpotlightSectionProps } from "./lib/types";

/**
 * CMS-only feature spotlight adapter → {@link FeatureSpotlightUi}.
 * Public pages use {@link FeatureSpotlightPublicSection}.
 */
export default function FeatureSpotlightSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "feature_spotlight",
  cmsMode,
  onEditField,
  id,
}: FeatureSpotlightSectionProps) {
  if (
    !isFeatureSpotlightPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  const items = resolveFeatureSpotlightUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <FeatureSpotlightUi
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
