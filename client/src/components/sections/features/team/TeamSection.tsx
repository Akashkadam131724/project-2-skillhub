"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import TeamUi from "./TeamUi";
import { resolveTeamUiItems } from "./lib/map";
import { isTeamPlacementShowable } from "./lib/placement";
import type { TeamSectionProps } from "./lib/types";

/**
 * CMS-only team adapter → {@link TeamUi}.
 * Public pages use {@link TeamPublicSection}.
 */
export default function TeamSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "team",
  cmsMode,
  onEditField,
  id,
}: TeamSectionProps) {
  if (!isTeamPlacementShowable({ items: mappingItems }, cmsMode)) {
    return null;
  }

  const items = resolveTeamUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <TeamUi
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
