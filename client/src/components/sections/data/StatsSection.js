"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import {
  itemStatLabel,
  itemStatValue,
  resolveItemsForSection,
} from "@/lib/item-types";
import {
  sectionGlassCardSurfaceProps,
  sectionLightCardSurfaceProps,
} from "@/lib/section-design-system";
import { isPlacementDarkBand } from "@/lib/section-theme";

function StatCell({ item, index, onDarkBand }) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item);
  const surfaceProps = onDarkBand
    ? sectionGlassCardSurfaceProps(
        "group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] p-5 transition hover:border-white/25 sm:min-h-[10.5rem] sm:p-6"
      )
    : sectionLightCardSurfaceProps(
        "group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] p-5 shadow-[0_12px_40px_-28px_color-mix(in_srgb,var(--ink)_22%,transparent)] transition hover:border-brand/25 hover:shadow-md sm:min-h-[10.5rem] sm:p-6"
      );

  return (
    <div {...surfaceProps}>
      <span className="section-theme-subtle text-[11px] font-semibold tracking-[0.18em] uppercase">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-none font-semibold tracking-tight sm:text-4xl">
          {value}
        </p>
        <p className="section-theme-muted mt-3 mb-0 max-w-[14rem] text-sm leading-snug sm:text-[15px]">
          {label}
        </p>
      </div>
      {onDarkBand ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-8 size-24 rounded-full bg-brand/25 blur-2xl transition group-hover:bg-brand/40"
        />
      ) : null}
    </div>
  );
}

/**
 * Stats band — tiles follow page / section band (light cards vs glass on dark).
 */
export default function StatsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
  section_theme,
  sectionTheme: sectionThemeProp,
  surfaceTone,
  surfaceBand,
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionThemeProp,
    surfaceTone,
    surfaceBand,
  });

  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="Outcomes"
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttonsInverted={onDarkBand}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
        className={
          onDarkBand
            ? "[&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:text-white"
            : undefined
        }
      />

      {items.length ? (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={item._id || item.id || i} className="min-w-0">
              <StatCell item={item} index={i} onDarkBand={onDarkBand} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
