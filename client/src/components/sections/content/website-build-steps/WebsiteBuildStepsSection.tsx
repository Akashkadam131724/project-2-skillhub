"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import WebsiteBuildStepsUi from "./WebsiteBuildStepsUi";
import { resolveWebsiteBuildStepUiItems } from "./lib/map";
import { isWebsiteBuildStepsPlacementShowable } from "./lib/placement";
import type { WebsiteBuildStepsSectionProps } from "./lib/types";

export default function WebsiteBuildStepsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "website_build_steps",
  cmsMode,
  onEditField,
  id,
}: WebsiteBuildStepsSectionProps) {
  const items = resolveWebsiteBuildStepUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isWebsiteBuildStepsPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  return (
    <WebsiteBuildStepsUi
      id={id}
      preview
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
      })}
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField, cmsMode })}

    />
  );
}
