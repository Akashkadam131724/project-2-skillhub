import AwardCard from "@/components/sections/features/cards/AwardCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type { AwardsUiProps } from "./lib/types";

/**
 * Pure awards layout — no CMS imports.
 */
export default function AwardsUi({
  title,
  subtitle,
  eyebrow = "Quality",
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  preview = false,
  id,
  className = "",
}: AwardsUiProps) {
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
              items.length || itemsBar || emptyState ? "mb-8 sm:mb-10" : ""
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
          <MobileCardPeekRow
            gapClassName="gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <AwardCard
                key={item.id ?? i}
                title={item.title}
                body={item.body}
                imageUrl={item.imageUrl}
                index={i}
                preview={preview}
              />
            ))}
          </MobileCardPeekRow>
        ) : (
          emptyState
        )}
      </SectionWrapper>
    </section>
  );
}
