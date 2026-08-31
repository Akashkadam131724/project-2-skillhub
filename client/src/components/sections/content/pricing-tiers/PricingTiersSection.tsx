"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import PricingTiersUi from "./PricingTiersUi";
import { resolvePricingTierUiItems } from "./lib/map";
import type { PricingTiersSectionProps } from "./lib/types";

export default function PricingTiersSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "pricing_tiers",
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
}: PricingTiersSectionProps) {
  const items = resolvePricingTierUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <PricingTiersUi
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
