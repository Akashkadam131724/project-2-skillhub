import SectionWrapper from "@/components/sections/SectionWrapper";
import LearningPathStepItemCard from "./LearningPathStepItemCard";
import type { LearningPathUiProps } from "./lib/types";

export default function LearningPathUi({
  title,
  subtitle,
  eyebrow = "Learning path",
  titleSlot,
  subtitleSlot,
  eyebrowSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: LearningPathUiProps) {
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(showEyebrow || showTitle || showSubtitle);

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
            {eyebrowSlot != null ? (
              eyebrowSlot
            ) : showEyebrow ? (
              <p className="text-brand m-0 text-[11px] font-semibold tracking-[0.22em] uppercase">
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
          <div className="flex flex-col gap-4">
            {items.map((item, i) => (
              <LearningPathStepItemCard
                key={item.id ?? i}
                item={item}
                index={i}
                preview={preview}
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
