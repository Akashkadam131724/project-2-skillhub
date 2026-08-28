import BuilderFeatureCardsUi from "./BuilderFeatureCardsUi";
import { resolveBuilderFeatureCardUiItems } from "./lib/map";
import { isBuilderFeatureCardsPlacementShowable } from "./lib/placement";
import type { BuilderFeatureCardsSectionProps } from "./lib/types";

/**
 * Public builder feature cards — maps placement props → {@link BuilderFeatureCardsUi}.
 */
export default function BuilderFeatureCardsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "builder_feature_cards",
  id,
}: BuilderFeatureCardsSectionProps) {
  if (
    !isBuilderFeatureCardsPlacementShowable(
      { items: mappingItems, section_key },
      false
    )
  ) {
    return null;
  }

  const items = resolveBuilderFeatureCardUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <BuilderFeatureCardsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
