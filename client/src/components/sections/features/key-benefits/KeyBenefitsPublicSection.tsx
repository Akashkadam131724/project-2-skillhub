import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import KeyBenefitsUi from "./KeyBenefitsUi";
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

  return (
    <KeyBenefitsUi
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
