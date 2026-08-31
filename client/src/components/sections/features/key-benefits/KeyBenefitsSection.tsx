"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import KeyBenefitsUi from "./KeyBenefitsUi";
import { resolveKeyBenefitsUiItems } from "./lib/map";
import { isKeyBenefitsPlacementShowable } from "./lib/placement";
import type { KeyBenefitsSectionProps } from "./lib/types";

/**
 * CMS-only key benefits adapter → {@link KeyBenefitsUi}.
 * Public pages use {@link KeyBenefitsPublicSection}.
 */
export default function KeyBenefitsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "key_benefits",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: KeyBenefitsSectionProps) {
  const items = resolveKeyBenefitsUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

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
      true
    )
  ) {
    return null;
  }

  return (
    <KeyBenefitsUi
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
