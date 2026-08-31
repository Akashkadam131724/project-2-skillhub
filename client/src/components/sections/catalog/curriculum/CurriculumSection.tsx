"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import CurriculumUi from "./CurriculumUi";
import { resolveCurriculumUiItems } from "./lib/map";
import type { CurriculumSectionProps } from "./lib/types";

export default function CurriculumSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "curriculum",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: CurriculumSectionProps) {
  const items = resolveCurriculumUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <CurriculumUi
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
