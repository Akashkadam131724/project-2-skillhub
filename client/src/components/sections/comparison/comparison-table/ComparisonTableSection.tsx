"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import ComparisonTableUi from "./ComparisonTableUi";
import { resolveComparisonUiItems } from "./lib/map";
import type { ComparisonTableSectionProps } from "./lib/types";

export default function ComparisonTableSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "comparison_table",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: ComparisonTableSectionProps) {
  const items = resolveComparisonUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <ComparisonTableUi
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
