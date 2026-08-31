"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import CastProfilesUi from "./CastProfilesUi";
import { resolveCastProfileUiItems } from "./lib/map";
import { isCastProfilesPlacementShowable } from "./lib/placement";
import type { CastProfilesSectionProps } from "./lib/types";

/**
 * CMS-only cast profiles adapter → {@link CastProfilesUi}.
 * Public pages use {@link CastProfilesPublicSection}.
 */
export default function CastProfilesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "cast_profiles",
  cmsMode,
  onEditField,
  id,
}: CastProfilesSectionProps) {
  if (
    !isCastProfilesPlacementShowable(
      { items: mappingItems, section_key, section_title, sub_title },
      cmsMode
    )
  ) {
    return null;
  }

  const items = resolveCastProfileUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <CastProfilesUi
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
