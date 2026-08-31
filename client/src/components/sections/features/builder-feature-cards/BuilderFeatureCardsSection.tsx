"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import BuilderFeatureCardsUi from "./BuilderFeatureCardsUi";
import { resolveBuilderFeatureCardUiItems } from "./lib/map";
import { isBuilderFeatureCardsPlacementShowable } from "./lib/placement";
import type { BuilderFeatureCardsSectionProps } from "./lib/types";

/**
 * CMS-only builder feature cards adapter → {@link BuilderFeatureCardsUi}.
 * Public pages use {@link BuilderFeatureCardsPublicSection}.
 */
export default function BuilderFeatureCardsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "builder_feature_cards",
  cmsMode,
  onEditField,
  id,
}: BuilderFeatureCardsSectionProps) {
  if (
    !isBuilderFeatureCardsPlacementShowable(
      { items: mappingItems, section_key, section_title, sub_title },
      cmsMode
    )
  ) {
    return null;
  }

  const items = resolveBuilderFeatureCardUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <BuilderFeatureCardsUi
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
