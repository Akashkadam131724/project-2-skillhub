import SectionButtons from "@/components/ui/SectionButtons";
import FaqUi from "./FaqUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { faqDarkBand, resolveFaqUiItems } from "../shared/lib/map";
import { isFaqPlacementShowable } from "../shared/lib/placement";
import type { FaqSectionProps } from "../shared/lib/types";

/**
 * Public FAQ entry — maps placement props → {@link FaqUi} with no CMS chrome.
 * CMS live edit uses {@link FaqSection} instead (section-registry-sync).
 */
export default function FaqPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "faq",
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
      },
      false
    )
  ) {
    return null;
  }

  const items = resolveFaqUiItems(section_key, mappingItems);
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
    <FaqUi
      id={id}
      eyebrow="FAQ"
      title={section_title}
      subtitle={sub_title}
      items={items}
      darkBand={darkBand}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
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
