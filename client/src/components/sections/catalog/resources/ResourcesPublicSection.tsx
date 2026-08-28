import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <ResourcesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
