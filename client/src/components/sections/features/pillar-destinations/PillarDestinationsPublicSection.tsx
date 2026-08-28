import PillarDestinationsUi from "./PillarDestinationsUi";
import { resolvePillarDestinationsUiItems } from "./lib/map";
import { isPillarDestinationsPlacementShowable } from "./lib/placement";
import type { PillarDestinationsSectionProps } from "./lib/types";

/**
 * Public pillar destinations — maps placement props → {@link PillarDestinationsUi}.
 */
export default function PillarDestinationsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "pillar_destinations",
  id,
}: PillarDestinationsSectionProps) {
  if (
    !isPillarDestinationsPlacementShowable({ items: mappingItems }, false)
  ) {
    return null;
  }

  const items = resolvePillarDestinationsUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <PillarDestinationsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
