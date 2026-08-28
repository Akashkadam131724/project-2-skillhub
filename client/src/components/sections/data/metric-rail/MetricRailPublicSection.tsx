import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import MetricRailUi from "./MetricRailUi";
import { resolveMetricRailUiItems } from "./lib/map";
import { isMetricRailPlacementShowable } from "./lib/placement";
import type { MetricRailSectionProps } from "./lib/types";

/**
 * Public metric rail — maps placement props → {@link MetricRailUi}.
 */
export default function MetricRailPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "metric_rail",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MetricRailSectionProps) {
  if (
    !isMetricRailPlacementShowable(
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

  const items = resolveMetricRailUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <MetricRailUi
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
