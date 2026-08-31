import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import TrustBadgesUi from "./TrustBadgesUi";
import { resolveTrustBadgeUiItems } from "./lib/map";
import { isTrustBadgesPlacementShowable } from "./lib/placement";
import type { TrustBadgesSectionProps } from "./lib/types";

/**
 * Public trust badges — maps placement props → {@link TrustBadgesUi}.
 */
export default function TrustBadgesPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "trust_badges",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TrustBadgesSectionProps) {
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
      false
    )
  ) {
    return null;
  }

  const items = resolveTrustBadgeUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <TrustBadgesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}
    />
  );
}
