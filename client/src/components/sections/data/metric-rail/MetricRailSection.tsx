"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import MetricRailUi from "./MetricRailUi";
import { resolveMetricRailUiItems } from "./lib/map";
import { isMetricRailPlacementShowable } from "./lib/placement";
import type { MetricRailSectionProps } from "./lib/types";

/**
 * CMS-only metric rail adapter → {@link MetricRailUi}.
 * Public pages use {@link MetricRailPublicSection}.
 */
export default function MetricRailSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "metric_rail",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MetricRailSectionProps) {
  const items = resolveMetricRailUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

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
      true
    )
  ) {
    return null;
  }

  return (
    <MetricRailUi
      id={id}
      preview
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}

    />
  );
}
