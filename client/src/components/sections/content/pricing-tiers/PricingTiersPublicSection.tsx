import SectionButtons from "@/components/ui/SectionButtons";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <PricingTiersUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      onDarkBand={onDarkBand}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              inverted={onDarkBand}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
