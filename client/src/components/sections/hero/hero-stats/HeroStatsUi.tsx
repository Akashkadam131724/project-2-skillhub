import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import {
  sectionGlassCardSurfaceProps,
  sectionLightCardSurfaceProps,
  DS_TEXT,
} from "@/lib/sections/section-design-system";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import type { HeroStatsUiProps } from "./lib/types";

function StatTile({
  item,
  onDarkBand,
}: {
  item: HeroStatsUiProps["stats"] extends (infer T)[] | undefined ? T : never;
  onDarkBand: boolean;
}) {
  const value = item.value || "—";
  const label = item.label || item.title || "";
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
        {value}
      </p>
      <p
        className={`mt-1 mb-0 text-xs font-medium tracking-wide uppercase ${DS_TEXT.muted}`}
      >
        {label}
      </p>
    </div>
  );
}

/** Hero with inline proof stats — follows page / section band theme. */
export default function HeroStatsUi({
  id,
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  footer = null,
  stats = [],
  statsAddSlot = null,
  itemsBar = null,
  section_theme,
  sectionTheme: sectionThemeProp,
  surfaceTone,
  surfaceBand,
}: HeroStatsUiProps) {
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionThemeProp,
    surfaceTone,
    surfaceBand,
  });
  const hasStats = stats.length > 0;

  return (
    <section
      id={id || undefined}
      className="border-b border-slate-200 dark:border-slate-800"
    >
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasStats
              ? "grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-14"
              : "flex flex-col gap-4"
          }
        >
          <div className="flex flex-col gap-4">
            {titleSlot ?? (
              <HeroTitle
                title={title}
                className={`m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl ${DS_TEXT.heading}`}
              />
            )}
            {subtitleSlot ?? (
              <HeroSubtitle
                subtitle={subtitle}
                className={`max-w-xl text-base leading-relaxed ${DS_TEXT.muted}`}
              />
            )}
            {footer}
            {statsAddSlot}
            {itemsBar}
          </div>

          {hasStats ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map((item, index) => (
                <StatTile
                  key={item.id ?? index}
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
