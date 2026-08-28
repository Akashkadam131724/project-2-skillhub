import BentoGridUi from "./BentoGridUi";
import { resolveBentoGridUiItems } from "./lib/map";
import { isBentoGridPlacementShowable } from "./lib/placement";
import type { BentoGridSectionProps } from "./lib/types";

/**
 * Public bento grid — maps placement props → {@link BentoGridUi}.
 */
export default function BentoGridPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "bento_grid",
  id,
}: BentoGridSectionProps) {
  if (
    !isBentoGridPlacementShowable({ items: mappingItems, section_key }, false)
  ) {
    return null;
  }

  const items = resolveBentoGridUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <BentoGridUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
