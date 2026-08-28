import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import SectionWrapper from "@/components/sections/SectionWrapper";
import TeamMemberItemCard from "./TeamMemberItemCard";
import type { TeamUiProps } from "./lib/types";

/**
 * Pure team layout — no CMS imports.
 */
export default function TeamUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  preview = false,
  id,
  className = "",
}: TeamUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = showTitle || showSubtitle;

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
            gapClassName="gap-5"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {items.map((item, i) => (
              <TeamMemberItemCard
                key={item.id ?? i}
                {...item}
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
