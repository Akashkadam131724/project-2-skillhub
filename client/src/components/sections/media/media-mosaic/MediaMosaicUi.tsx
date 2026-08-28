import SectionWrapper from "@/components/sections/SectionWrapper";
import MediaMosaicItemCard from "./MediaMosaicItemCard";
import type { MediaMosaicUiProps } from "./lib/types";

export default function MediaMosaicUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: MediaMosaicUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(showTitle || showSubtitle);

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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {items.map((item, i) => (
              <MediaMosaicItemCard
                key={item.id ?? i}
                item={item}
                preview={preview}
                featured={item.featured}
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
