import {
  SectionItemGrid,
  SectionLayoutRoot,
} from "@/components/sections/layout";
import {
  DS_RADIUS,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
import {
  sectionGlassCardSurfaceProps,
  sectionLightCardSurfaceProps,
} from "@/lib/sections/section-design-system";
import type { StatUiItem, StatsUiProps } from "./lib/types";

function StatCell({
  item,
  index,
  onDarkBand,
  preview = false,
}: {
  item: StatUiItem;
  index: number;
  onDarkBand?: boolean;
  preview?: boolean;
}) {
  const surfaceProps = onDarkBand
    ? sectionGlassCardSurfaceProps(
        sectionClassNames(
          DS_RADIUS.tile,
          "group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden p-5 transition hover:border-white/25 sm:min-h-[10.5rem] sm:p-6"
        )
      )
    : sectionLightCardSurfaceProps(
        sectionClassNames(
          DS_RADIUS.tile,
          "group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden p-5 shadow-[0_12px_40px_-28px_color-mix(in_srgb,var(--ink)_22%,transparent)] transition hover:border-brand/25 hover:shadow-md sm:min-h-[10.5rem] sm:p-6"
        )
      );

  const value = item.value || (preview ? "0" : "");
  const label = item.label || (preview ? "Label" : "");

  return (
    <div {...surfaceProps}>
      <span className="section-theme-subtle text-[11px] font-semibold tracking-[0.18em] uppercase">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p
          className={`section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-none font-semibold tracking-tight sm:text-4xl ${
            preview && !item.value ? "italic opacity-50" : ""
          }`}
        >
          {value || null}
        </p>
        <p
          className={`section-theme-muted mt-3 mb-0 max-w-[14rem] text-sm leading-snug sm:text-[15px] ${
            preview && !item.label ? "italic opacity-50" : ""
          }`}
        >
          {label || null}
        </p>
      </div>
      {onDarkBand ? (
        <div
          aria-hidden
          className={sectionClassNames(
            DS_RADIUS.pill,
            "pointer-events-none absolute -right-6 -bottom-8 size-24 bg-brand/25 blur-2xl transition group-hover:bg-brand/40"
          )}
        />
      ) : null}
    </div>
  );
}

/**
 * Pure stats layout — no CMS imports.
 */
export default function StatsUi({
  title,
  subtitle,
  eyebrow = "Outcomes",
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  onDarkBand = false,
  preview = false,
  id,
  className = "",
}: StatsUiProps) {
  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
      {items.length ? (
        <SectionItemGrid cols={4} peekOnMobile={false}>
          {items.map((item, i) => (
            <StatCell
              key={item.id ?? i}
              item={item}
              index={i}
              onDarkBand={onDarkBand}
              preview={preview}
            />
          ))}
        </SectionItemGrid>
      ) : (
        emptyState
      )}
    </SectionLayoutRoot>
  );
}
