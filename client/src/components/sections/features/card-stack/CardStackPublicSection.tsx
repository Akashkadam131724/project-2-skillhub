import CardStackUi from "./CardStackUi";
import { resolveCardStackUiItems } from "./lib/map";
import { isCardStackPlacementShowable } from "./lib/placement";
import type { CardStackSectionProps } from "./lib/types";

/**
 * Public card stack — maps placement props → {@link CardStackUi}.
 */
export default function CardStackPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "card_stack",
  id,
}: CardStackSectionProps) {
  if (
    !isCardStackPlacementShowable({ items: mappingItems, section_key }, false)
  ) {
    return null;
  }

  const items = resolveCardStackUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <CardStackUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
