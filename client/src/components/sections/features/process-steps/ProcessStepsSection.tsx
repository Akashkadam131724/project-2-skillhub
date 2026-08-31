"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import ProcessStepsUi from "./ProcessStepsUi";
import { resolveProcessStepUiItems } from "./lib/map";
import { isProcessStepsPlacementShowable } from "./lib/placement";
import type { ProcessStepsSectionProps } from "./lib/types";

/**
 * CMS-only process steps adapter → {@link ProcessStepsUi}.
 * Public pages use {@link ProcessStepsPublicSection}.
 */
export default function ProcessStepsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "process_steps",
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
}: ProcessStepsSectionProps) {
  const items = resolveProcessStepUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (
    !isProcessStepsPlacementShowable(
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
    <ProcessStepsUi
      id={id}
      preview
      onDarkBand={onDarkBand}
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        inverted: onDarkBand,
      })}
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
