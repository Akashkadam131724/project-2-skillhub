import FaqItemCard from "../shared/FaqItemCard";
import { SectionLayoutRoot } from "@/components/sections/layout";
import type { FaqTwoColumnUiProps } from "./lib/types";

/**
 * Pure two-column FAQ layout — no CMS imports.
 */
export default function FaqTwoColumnUi({
  title,
  subtitle,
  eyebrow = "FAQ",
  titleSlot,
  subtitleSlot,
  headerControls,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  headerSide = "left",
  darkBand = false,
  preview = false,
  id,
  className = "",
}: FaqTwoColumnUiProps) {
  const headerCol = (
    <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-[calc(var(--site-header-h,4.25rem)+5rem)] lg:self-start">
      {headerControls}
      {eyebrow ? (
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          {eyebrow}
        </p>
      ) : null}
      {titleSlot != null ? (
        titleSlot
      ) : title ? (
        <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight section-theme-heading sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {subtitleSlot != null ? (
        subtitleSlot
      ) : subtitle ? (
        <p className="m-0 text-base leading-relaxed section-theme-muted">
          {subtitle}
        </p>
      ) : null}
      {footer}
    </div>
  );

  const faqCol = (
    <div className="min-w-0">
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
    </div>
  );

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      layout="wrapper"
      hasBodyContent
    >
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div
          className={`min-w-0 ${
            headerSide === "left" ? "lg:order-1" : "lg:order-2"
          }`}
        >
          {headerCol}
        </div>
        <div
          className={`min-w-0 ${
            headerSide === "left" ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {faqCol}
        </div>
      </div>
    </SectionLayoutRoot>
  );
}
