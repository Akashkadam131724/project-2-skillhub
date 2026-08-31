"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import AwardsUi from "./AwardsUi";
import { resolveAwardUiItems } from "./lib/map";
import { isAwardsPlacementShowable } from "./lib/placement";
import type { AwardsSectionProps } from "./lib/types";

/**
 * CMS-only awards adapter → {@link AwardsUi}.
 * Public pages use {@link AwardsPublicSection}.
 */
export default function AwardsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "awards",
  onEditField,
  id,
}: AwardsSectionProps) {
  const items = resolveAwardUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isAwardsPlacementShowable(
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
    <AwardsUi
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
