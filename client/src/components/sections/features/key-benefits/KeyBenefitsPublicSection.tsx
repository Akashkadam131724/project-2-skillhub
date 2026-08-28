import SectionButtons from "@/components/ui/SectionButtons";
import KeyBenefitsUi from "./KeyBenefitsUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { resolveKeyBenefitsUiItems } from "./lib/map";
import { isKeyBenefitsPlacementShowable } from "./lib/placement";
import type { KeyBenefitsSectionProps } from "./lib/types";

/**
 * Public key benefits — maps placement props → {@link KeyBenefitsUi}.
 */
export default function KeyBenefitsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "key_benefits",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: KeyBenefitsSectionProps) {
  if (
    !isKeyBenefitsPlacementShowable(
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

  const items = resolveKeyBenefitsUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <KeyBenefitsUi
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
