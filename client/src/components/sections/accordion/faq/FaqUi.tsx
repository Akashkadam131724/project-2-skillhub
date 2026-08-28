import FaqItemCard from "../shared/FaqItemCard";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type { FaqUiProps } from "./lib/types";

/**
 * Pure FAQ layout — no CMS imports.
 * Pass plain strings / item DTOs, or slots for chrome (CMS adapter injects pencils).
 */
export default function FaqUi({
  title,
  subtitle,
  eyebrow = "FAQ",
  titleSlot,
  subtitleSlot,
  headerAction,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  darkBand = false,
  preview = false,
  id,
  className = "",
}: FaqUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(eyebrow || showTitle || showSubtitle || headerAction);

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
              items.length || itemsBar || emptyState || footer ? "mb-8 sm:mb-10" : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
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
            </div>
            {headerAction ? (
              <div className="shrink-0 sm:pb-0.5">{headerAction}</div>
            ) : null}
          </header>
        ) : null}

        {itemsBar}

        {items.length ? (
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <FaqItemCard
                key={item.id ?? i}
                question={item.question}
                answer={item.answer}
                buttons={item.buttons}
                index={i}
                preview={preview}
                onDarkBand={darkBand}
              />
            ))}
          </div>
        ) : (
          emptyState
        )}

        {footer}
      </SectionWrapper>
    </section>
  );
}
