"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import SuccessStoriesUi from "./SuccessStoriesUi";
import { resolveSuccessStoryUiItems } from "./lib/map";
import { isSuccessStoriesPlacementShowable } from "./lib/placement";
import type { SuccessStoriesSectionProps } from "../shared/lib/types";

export default function TabsSuccessStoriesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "tabs_success_stories",
  onEditField,
  onFormOpen,
  id,
}: SuccessStoriesSectionProps) {
  const stories = resolveSuccessStoryUiItems(mappingItems, { cmsMode: true });

  if (
    !isSuccessStoriesPlacementShowable(
      { section_key, section_title, sub_title, items: mappingItems },
      true
    )
  ) {
    return null;
  }

  return (
    <SuccessStoriesUi
      id={id}
      preview
      onFormOpen={onFormOpen}
      stories={stories}
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}

          {...cmsSectionChrome({
        section_key,
        itemCount: stories.length,
        onEditField,
        onFormOpen,
      })}
    />
  );
}
