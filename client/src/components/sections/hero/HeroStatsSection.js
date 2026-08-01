"use client";

import SectionWrapper from "../SectionWrapper";
import SectionButtonsFooter from "../SectionButtonsFooter";
import { HeroTitle, HeroSubtitle, shouldHideEmptyHero } from "./HeroFields";
import {
  sectionGlassCardSurfaceProps,
  sectionLightCardSurfaceProps,
  DS_TEXT,
} from "@/lib/sections/section-design-system";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import { itemStatLabel, itemStatValue } from "@/lib/sections/item-types";

function StatTile({ item, onDarkBand }) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item) || item?.title || "";
  const surfaceProps = onDarkBand
    ? sectionGlassCardSurfaceProps("px-4 py-4")
    : sectionLightCardSurfaceProps(
        "border px-4 py-4 shadow-[0_12px_40px_-28px_color-mix(in_srgb,var(--ink)_22%,transparent)]"
      );

  return (
    <div {...surfaceProps}>
      <p
        className={`m-0 text-2xl font-bold tracking-tight sm:text-3xl ${DS_TEXT.heading}`}
      >
        {value || "—"}
      </p>
      <p className={`mt-1 mb-0 text-xs font-medium tracking-wide uppercase ${DS_TEXT.muted}`}>
        {label}
      </p>
    </div>
  );
}

/** Hero with inline proof stats — follows page / section band theme. */
export default function HeroStatsSection({
  section_title,
  sub_title,
  items,
  buttons,
  button_title,
  target_url,
  section_theme,
  sectionTheme: sectionThemeProp,
  surfaceTone,
  surfaceBand,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  if (
    shouldHideEmptyHero("hero_stats", {
      section_title,
      sub_title,
      items,
      buttons,
      button_title,
      target_url,
      cmsMode,
    })
  ) {
    return null;
  }

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionThemeProp,
    surfaceTone,
    surfaceBand,
  });

  const stats = Array.isArray(items)
    ? items.filter(
        (i) =>
          i?.status !== false &&
          Boolean(i?.value || i?.label || i?.title)
      )
    : [];
  const hasStats = stats.length > 0;

  return (
    <section className="border-b border-slate-200 dark:border-slate-800">
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasStats
              ? "grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-14"
              : "flex flex-col gap-4"
          }
        >
          <div className="flex flex-col gap-4">
            <HeroTitle
              section_title={section_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              inverted={onDarkBand}
              className={`m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl ${DS_TEXT.heading}`}
            />
            <HeroSubtitle
              sub_title={sub_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              inverted={onDarkBand}
              className={`max-w-xl text-base leading-relaxed ${DS_TEXT.muted}`}
            />
            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              inverted={onDarkBand}
              className="mt-2"
            />
            {cmsMode && !hasStats ? (
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
            ) : null}
          </div>

          {hasStats ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map((item, index) => (
                <StatTile
                  key={item._id || item.id || index}
                  item={item}
                  onDarkBand={onDarkBand}
                />
              ))}
            </div>
          ) : null}
        </div>
      </SectionWrapper>
    </section>
  );
}
