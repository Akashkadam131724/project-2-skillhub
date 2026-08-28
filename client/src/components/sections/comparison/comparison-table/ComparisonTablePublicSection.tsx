import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import ComparisonTableUi from "./ComparisonTableUi";
import { resolveComparisonUiItems } from "./lib/map";
import { isComparisonPlacementShowable } from "./lib/placement";
import type { ComparisonTableSectionProps } from "./lib/types";

export default function ComparisonTablePublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "comparison_table",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: ComparisonTableSectionProps) {
  if (
    !isComparisonPlacementShowable(
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

  const items = resolveComparisonUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <ComparisonTableUi
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
