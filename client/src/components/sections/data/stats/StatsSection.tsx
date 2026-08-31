"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import StatsUi from "./StatsUi";
import { resolveStatUiItems } from "./lib/map";
import { isStatsPlacementShowable } from "./lib/placement";
import type { StatsSectionProps } from "./lib/types";

/**
 * CMS-only stats adapter → {@link StatsUi}.
 * Public pages use {@link StatsPublicSection}.
 */
export default function StatsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
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
}: StatsSectionProps) {
  const items = resolveStatUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (
    !isStatsPlacementShowable(
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
    <StatsUi
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
        onDarkBand,
      })}
    />
  );
}
