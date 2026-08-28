import SectionButtons from "@/components/ui/SectionButtons";
import FaqTwoColumnUi from "./FaqTwoColumnUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { faqDarkBand, resolveFaqUiItems } from "../shared/lib/map";
import { isFaqPlacementShowable } from "../shared/lib/placement";
import type { FaqSectionProps } from "../shared/lib/types";
import { normalizeFaqHeaderSide } from "./lib/map";

/**
 * Public two-column FAQ — maps placement props → {@link FaqTwoColumnUi}.
 */
export default function FaqTwoColumnPublicSection({
  section_title,
  sub_title,
  data = {},
  items: mappingItems,
  section_key = "faq_two_column",
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: FaqSectionProps) {
  if (
    !isFaqPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
        data,
      },
      false
    )
  ) {
    return null;
  }

  const items = resolveFaqUiItems(section_key, mappingItems);
  const headerSide = normalizeFaqHeaderSide(data);
  const darkBand = faqDarkBand({
    section_theme,
    sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <FaqTwoColumnUi
      id={id}
      eyebrow="FAQ"
      title={section_title}
      subtitle={sub_title}
      items={items}
      headerSide={headerSide}
      darkBand={darkBand}
      footer={
        list.length ? (
          <div className="mt-2 sm:mt-4">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              inverted={darkBand}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
