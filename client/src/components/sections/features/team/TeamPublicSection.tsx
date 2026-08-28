import TeamUi from "./TeamUi";
import { resolveTeamUiItems } from "./lib/map";
import { isTeamPlacementShowable } from "./lib/placement";
import type { TeamSectionProps } from "./lib/types";

/**
 * Public team — maps placement props → {@link TeamUi}.
 */
export default function TeamPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "team",
  id,
}: TeamSectionProps) {
  if (!isTeamPlacementShowable({ items: mappingItems }, false)) {
    return null;
  }

  const items = resolveTeamUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <TeamUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
