"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import HeroStatsUi from "./HeroStatsUi";
import {
  buildHeroLayoutCmsSlots,
  heroLayoutCmsFooter,
} from "@/components/sections/hero/shared/hero-layout-cms";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import {
  DS_TYPE,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import { itemStatLabel, itemStatValue } from "@/lib/sections/item-types";
import type { HeroStatsSectionProps, HeroStatsUiItem } from "./lib/types";

function resolveHeroStatsUiItems(
  items: unknown,
  cmsMode: boolean
): HeroStatsUiItem[] {
  if (!Array.isArray(items)) return [];
  const list = cmsMode
    ? items
    : items.filter(
        (item) =>
          item &&
          (item as { status?: boolean }).status !== false &&
          Boolean(
            (item as { value?: string }).value ||
              (item as { label?: string }).label ||
              (item as { title?: string }).title
          )
      );

  return list.map((item, index) => ({
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

/** CMS-only hero_stats adapter → {@link HeroStatsUi}. */
export default function HeroStatsSection({
  section_title,
  sub_title,
  items,
  section_key = "hero_stats",
  buttons,
  button_title,
  target_url,
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  onEditField,
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

  if (!isHeroPlacementShowable("hero_stats", props, true)) {
    return null;
  }

  const stats = resolveHeroStatsUiItems(items, true);
  const onDarkBand = isPlacementDarkBand({
    section_theme,
    sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  const slots = buildHeroLayoutCmsSlots({
    section_title,
    sub_title,
    onEditField,
    inverted: onDarkBand,
    includeBody: false,
    titleClassName: sectionClassNames(
      DS_TYPE.displayTitle,
      "text-3xl sm:text-4xl"
    ),
    subtitleClassName: sectionClassNames(DS_TYPE.subtitle, "max-w-xl"),
  });

  return (
    <HeroStatsUi
      id={id}
      {...slots}
      stats={stats}
      section_theme={section_theme}
      sectionTheme={sectionTheme}
      surfaceTone={surfaceTone}
      surfaceBand={surfaceBand}
      
      statsAddSlot={
        !stats.length ? (
          <button
            type="button"
            onClick={() => onEditField?.("items")}
            className={`mt-1 self-start rounded-md border border-dashed px-3 py-1.5 text-xs ${
              onDarkBand
                ? "border-white/40 text-white/70"
                : "border-slate-300 text-slate-500"
            }`}
          >
            Add stats…
          </button>
        ) : null
      }
      
          {...cmsSectionChrome({
        section_key,
        itemCount: stats.length,
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
