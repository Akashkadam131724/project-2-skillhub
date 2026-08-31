"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import LearningPathUi from "./LearningPathUi";
import { resolveLearningPathStepUiItems } from "./lib/map";
import { isLearningPathPlacementShowable } from "./lib/placement";
import type { LearningPathSectionProps } from "./lib/types";

/** CMS-only learning path adapter → {@link LearningPathUi}. */
export default function LearningPathSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "learning_path",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: LearningPathSectionProps) {
  const items = resolveLearningPathStepUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isLearningPathPlacementShowable(
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
    <LearningPathUi
      id={id}
      preview
      eyebrow="Learning path"
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
