import SuccessStoriesUi from "./SuccessStoriesUi";
import { resolveSuccessStoryUiItems } from "./lib/map";
import { isSuccessStoriesPlacementShowable } from "./lib/placement";
import type { SuccessStoriesSectionProps } from "../shared/lib/types";

export default function TabsSuccessStoriesPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "tabs_success_stories",
  onFormOpen,
  id,
}: SuccessStoriesSectionProps) {
  if (
    !isSuccessStoriesPlacementShowable(
      { section_key, section_title, sub_title, items: mappingItems },
      false
    )
  ) {
    return null;
  }

  const stories = resolveSuccessStoryUiItems(mappingItems);
  if (!stories.length) return null;

  return (
    <SuccessStoriesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      stories={stories}
      onFormOpen={onFormOpen}
    />
  );
}
