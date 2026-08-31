import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
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

  return (
    <MetricRailUi
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
