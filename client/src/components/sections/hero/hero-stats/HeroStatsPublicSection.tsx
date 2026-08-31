import { itemStatLabel, itemStatValue } from "@/lib/sections/item-types";
import HeroStatsUi from "./HeroStatsUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroStatsSectionProps, HeroStatsUiItem } from "./lib/types";

function resolveHeroStatsUiItems(items: unknown): HeroStatsUiItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter(
      (item) =>
        item &&
        (item as { status?: boolean }).status !== false &&
        Boolean(
          (item as { value?: string }).value ||
            (item as { label?: string }).label ||
            (item as { title?: string }).title
        )
    )
    .map((item, index) => ({
      id: String(
        (item as { _id?: string; id?: string })._id ||
          (item as { id?: string }).id ||
          index
      ),
      value: itemStatValue(item) || (item as { value?: string }).value,
      label:
        itemStatLabel(item) ||
        (item as { label?: string }).label ||
        (item as { title?: string }).title,
      title: (item as { title?: string }).title,
    }));
}

/** Public hero_stats — maps placement props → {@link HeroStatsUi}. */
export default function HeroStatsPublicSection({
  section_title,
  sub_title,
  items,
  buttons,
  button_title,
  target_url,
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  onFormOpen,
  id,
}: HeroStatsSectionProps) {
  const props = {
    section_title,
    sub_title,
    items,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_stats", props, false)) {
    return null;
  }

  const stats = resolveHeroStatsUiItems(items);

  return (
    <HeroStatsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      stats={stats}
      section_theme={section_theme}
      sectionTheme={sectionTheme}
      surfaceTone={surfaceTone}
      surfaceBand={surfaceBand}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-2",
        buttonsClassName: "flex flex-wrap items-center gap-3",
      })}
    />
  );
}
