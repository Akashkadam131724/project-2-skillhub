import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
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

  return (
    <ComparisonTableUi
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
