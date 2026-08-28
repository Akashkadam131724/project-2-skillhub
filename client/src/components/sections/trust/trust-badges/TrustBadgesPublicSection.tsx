import SectionButtons from "@/components/ui/SectionButtons";
import TrustBadgesUi from "./TrustBadgesUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <TrustBadgesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
