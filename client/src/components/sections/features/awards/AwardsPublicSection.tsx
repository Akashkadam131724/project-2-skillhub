import AwardsUi from "./AwardsUi";
import { resolveAwardUiItems } from "./lib/map";
import { isAwardsPlacementShowable } from "./lib/placement";
import type { AwardsSectionProps } from "./lib/types";

/**
 * Public awards — maps placement props → {@link AwardsUi}.
 */
export default function AwardsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "awards",
  id,
}: AwardsSectionProps) {
  if (
    !isAwardsPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
      },
      false
    )
  ) {
    return null;
  }

  const items = resolveAwardUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <AwardsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
