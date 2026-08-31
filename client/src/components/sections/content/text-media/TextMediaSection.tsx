"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import TextMediaUi from "./TextMediaUi";
import { resolveTextMediaUiItems } from "./lib/map";
import type { TextMediaSectionProps } from "./lib/types";

export default function TextMediaSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "text_media",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TextMediaSectionProps) {
  const items = resolveTextMediaUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <TextMediaUi
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
