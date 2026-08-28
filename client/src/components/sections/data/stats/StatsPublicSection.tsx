import SectionButtons from "@/components/ui/SectionButtons";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <StatsUi
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
