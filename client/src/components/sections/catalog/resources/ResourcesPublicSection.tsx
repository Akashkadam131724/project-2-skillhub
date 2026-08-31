import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import ResourcesUi from "./ResourcesUi";
import { resolveResourcesUiItems } from "./lib/map";
import { isResourcesPlacementShowable } from "./lib/placement";
import type { ResourcesSectionProps } from "./lib/types";

export default function ResourcesPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "resources",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: ResourcesSectionProps) {
  if (
    !isResourcesPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      false
    )
  ) {
    return null;
  }

  const items = resolveResourcesUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <ResourcesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}
    />
  );
}
