"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import TrainingOptionsUi from "./TrainingOptionsUi";
import { resolveTrainingOptionUiItems } from "./lib/map";
import { isTrainingOptionsPlacementShowable } from "./lib/placement";
import type { TrainingOptionsSectionProps } from "./lib/types";

/**
 * CMS-only training options adapter → {@link TrainingOptionsUi}.
 * Public pages use {@link TrainingOptionsPublicSection}.
 */
export default function TrainingOptionsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "training_options",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TrainingOptionsSectionProps) {
  const items = resolveTrainingOptionUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (
    !isTrainingOptionsPlacementShowable(
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
    <TrainingOptionsUi
      id={id}
      preview
      onDarkBand={onDarkBand}
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
        onDarkBand: onDarkBand,
      })}

    />
  );
}
