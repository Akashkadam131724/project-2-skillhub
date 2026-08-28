import SectionWrapper from "@/components/sections/SectionWrapper";
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
        "group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] p-5 transition hover:border-white/25 sm:min-h-[10.5rem] sm:p-6"
      )
    : sectionLightCardSurfaceProps(
        "group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] p-5 shadow-[0_12px_40px_-28px_color-mix(in_srgb,var(--ink)_22%,transparent)] transition hover:border-brand/25 hover:shadow-md sm:min-h-[10.5rem] sm:p-6"
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
          className="pointer-events-none absolute -right-6 -bottom-8 size-24 rounded-full bg-brand/25 blur-2xl transition group-hover:bg-brand/40"
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
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(eyebrow || showTitle || showSubtitle);

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-2.5 sm:gap-3 ${
              items.length || itemsBar || emptyState || footer
                ? "mb-8 sm:mb-10"
                : ""
            }`}
          >
            {eyebrow ? (
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
            {titleSlot != null ? (
              titleSlot
            ) : showTitle ? (
              <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {subtitleSlot != null ? (
              subtitleSlot
            ) : showSubtitle ? (
              <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

        {itemsBar}

        {items.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
            {items.map((item, i) => (
              <li key={item.id ?? i} className="min-w-0">
                <StatCell
                  item={item}
                  index={i}
                  onDarkBand={onDarkBand}
                  preview={preview}
                />
              </li>
            ))}
          </ul>
        ) : (
          emptyState
        )}

        {footer}
      </SectionWrapper>
    </section>
  );
}
