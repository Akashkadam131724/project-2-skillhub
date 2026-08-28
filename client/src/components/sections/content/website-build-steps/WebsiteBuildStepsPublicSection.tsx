import WebsiteBuildStepsUi from "./WebsiteBuildStepsUi";
import { resolveWebsiteBuildStepUiItems } from "./lib/map";
import { isWebsiteBuildStepsPlacementShowable } from "./lib/placement";
import type { WebsiteBuildStepsSectionProps } from "./lib/types";

export default function WebsiteBuildStepsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "website_build_steps",
  id,
}: WebsiteBuildStepsSectionProps) {
  if (
    !isWebsiteBuildStepsPlacementShowable({ items: mappingItems }, false)
  ) {
    return null;
  }

  const items = resolveWebsiteBuildStepUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <WebsiteBuildStepsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
