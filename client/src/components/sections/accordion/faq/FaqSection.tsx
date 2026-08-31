"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import FaqUi from "./FaqUi";
import { faqDarkBand, resolveFaqUiItems } from "../shared/lib/map";
import type { FaqSectionProps } from "../shared/lib/types";

/**
 * CMS-only FAQ adapter → {@link FaqUi}.
 * Public pages use {@link FaqPublicSection}.
 */
export default function FaqSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "faq",
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: FaqSectionProps) {
  const items = resolveFaqUiItems(section_key, mappingItems, { cmsMode: true });
  const darkBand = faqDarkBand({
    section_theme,
    sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <FaqUi
      id={id}
      eyebrow="FAQ"
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      items={items}
      darkBand={darkBand}
      preview
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        onDarkBand: darkBand,
      })}
    />
  );
}
