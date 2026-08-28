import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <TimelineVerticalUi
      id={id}
      eyebrow={(in_page_nav_title || "").trim() || undefined}
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
