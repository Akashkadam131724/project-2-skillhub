import FeatureSpotlightUi from "./FeatureSpotlightUi";
import { resolveFeatureSpotlightUiItems } from "./lib/map";
import { isFeatureSpotlightPlacementShowable } from "./lib/placement";
import type { FeatureSpotlightSectionProps } from "./lib/types";

/**
 * Public feature spotlight — maps placement props → {@link FeatureSpotlightUi}.
 */
export default function FeatureSpotlightPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "feature_spotlight",
  id,
}: FeatureSpotlightSectionProps) {
  if (
    !isFeatureSpotlightPlacementShowable({ items: mappingItems }, false)
  ) {
    return null;
  }

  const items = resolveFeatureSpotlightUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <FeatureSpotlightUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
