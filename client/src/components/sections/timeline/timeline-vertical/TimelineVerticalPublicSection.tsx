import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import TimelineVerticalUi from "./TimelineVerticalUi";
import { resolveTimelineStepUiItems } from "./lib/map";
import { isTimelineVerticalPlacementShowable } from "./lib/placement";
import type { TimelineVerticalSectionProps } from "./lib/types";

/** Public vertical timeline — maps placement props → {@link TimelineVerticalUi}. */
export default function TimelineVerticalPublicSection({
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "timeline_vertical",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TimelineVerticalSectionProps) {
  if (
    !isTimelineVerticalPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        in_page_nav_title,
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

  const items = resolveTimelineStepUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <TimelineVerticalUi
      id={id}
      eyebrow={(in_page_nav_title || "").trim() || undefined}
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
