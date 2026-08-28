import SectionButtons from "@/components/ui/SectionButtons";
import MasonryQuotesUi from "./MasonryQuotesUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { resolveMasonryQuoteUiItems } from "./lib/map";
import { isMasonryQuotesPlacementShowable } from "./lib/placement";
import type { MasonryQuotesSectionProps } from "./lib/types";

/** Public masonry quotes — maps placement props → {@link MasonryQuotesUi}. */
export default function MasonryQuotesPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "masonry_quotes",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MasonryQuotesSectionProps) {
  if (
    !isMasonryQuotesPlacementShowable(
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

  const items = resolveMasonryQuoteUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <MasonryQuotesUi
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
