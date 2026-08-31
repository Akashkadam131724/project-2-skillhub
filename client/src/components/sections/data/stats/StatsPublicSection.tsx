import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import StatsUi from "./StatsUi";
import { resolveStatUiItems } from "./lib/map";
import { isStatsPlacementShowable } from "./lib/placement";
import type { StatsSectionProps } from "./lib/types";

/**
 * Public stats — maps placement props → {@link StatsUi}.
 */
export default function StatsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: StatsSectionProps) {
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
      false
    )
  ) {
    return null;
  }

  const items = resolveStatUiItems(section_key, mappingItems);
  if (!items.length) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <StatsUi
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
