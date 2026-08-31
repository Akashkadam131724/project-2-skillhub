"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import ResourcesUi from "./ResourcesUi";
import { resolveResourcesUiItems } from "./lib/map";
import type { ResourcesSectionProps } from "./lib/types";

export default function ResourcesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "resources",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: ResourcesSectionProps) {
  const items = resolveResourcesUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <ResourcesUi
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
