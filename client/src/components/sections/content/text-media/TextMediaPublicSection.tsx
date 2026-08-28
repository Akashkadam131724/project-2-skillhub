import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import TextMediaUi from "./TextMediaUi";
import { resolveTextMediaUiItems } from "./lib/map";
import { isTextMediaPlacementShowable } from "./lib/placement";
import type { TextMediaSectionProps } from "./lib/types";

export default function TextMediaPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "text_media",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TextMediaSectionProps) {
  if (
    !isTextMediaPlacementShowable(
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

  const items = resolveTextMediaUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <TextMediaUi
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
