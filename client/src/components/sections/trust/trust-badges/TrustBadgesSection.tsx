"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import TrustBadgesUi from "./TrustBadgesUi";
import { resolveTrustBadgeUiItems } from "./lib/map";
import { isTrustBadgesPlacementShowable } from "./lib/placement";
import type { TrustBadgesSectionProps } from "./lib/types";

/**
 * CMS-only trust badges adapter → {@link TrustBadgesUi}.
 * Public pages use {@link TrustBadgesPublicSection}.
 */
export default function TrustBadgesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "trust_badges",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TrustBadgesSectionProps) {
  const items = resolveTrustBadgeUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isTrustBadgesPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <TrustBadgesUi
      id={id}
      preview
      eyebrow="Trust"
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}

    />
  );
}
