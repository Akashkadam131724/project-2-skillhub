import CastProfilesUi from "./CastProfilesUi";
import { resolveCastProfileUiItems } from "./lib/map";
import { isCastProfilesPlacementShowable } from "./lib/placement";
import type { CastProfilesSectionProps } from "./lib/types";

/**
 * Public cast profiles — maps placement props → {@link CastProfilesUi}.
 */
export default function CastProfilesPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "cast_profiles",
  id,
}: CastProfilesSectionProps) {
  if (
    !isCastProfilesPlacementShowable({ items: mappingItems, section_key }, false)
  ) {
    return null;
  }

  const items = resolveCastProfileUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <CastProfilesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
