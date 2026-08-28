import SectionWrapper from "@/components/sections/SectionWrapper";
import TextMediaRow from "./TextMediaRow";
import type { TextMediaUiProps } from "./lib/types";

export default function TextMediaUi({
  title,
  subtitle,
  eyebrow,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: TextMediaUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(eyebrow || showTitle || showSubtitle);
  const resolvedEyebrow =
    eyebrow ?? (showTitle || showSubtitle ? "Learning paths" : undefined);

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
            {resolvedEyebrow ? (
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {resolvedEyebrow}
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
          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-24">
            {items.map((item, i) => (
              <TextMediaRow
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
