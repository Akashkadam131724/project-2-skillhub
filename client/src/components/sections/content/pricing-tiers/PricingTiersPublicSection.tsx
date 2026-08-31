import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import PricingTiersUi from "./PricingTiersUi";
import { resolvePricingTierUiItems } from "./lib/map";
import { isPricingTiersPlacementShowable } from "./lib/placement";
import type { PricingTiersSectionProps } from "./lib/types";

export default function PricingTiersPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "pricing_tiers",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: PricingTiersSectionProps) {
  if (
    !isPricingTiersPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      false
    )
  ) {
    return null;
  }

  const items = resolvePricingTierUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <PricingTiersUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      onDarkBand={onDarkBand}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        inverted: onDarkBand,
      })}
    />
  );
}
