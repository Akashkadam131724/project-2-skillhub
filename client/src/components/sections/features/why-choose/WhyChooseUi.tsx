import WhyChooseItemCard from "./WhyChooseItemCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type { WhyChooseUiProps } from "./lib/types";

/**
 * Pure why-choose layout — no CMS imports.
 */
export default function WhyChooseUi({
  title,
  subtitle,
  eyebrow,
  titleSlot,
  subtitleSlot,
  eyebrowSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  onDarkBand = false,
  preview = false,
  id,
  className = "",
}: WhyChooseUiProps) {
  const lightBand = !onDarkBand;
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = showEyebrow || showTitle || showSubtitle;

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden py-16 sm:py-20 ${
        lightBand ? "text-ink" : "text-white"
      } ${className}`.trim()}
    >
      {!lightBand ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand) 45%, transparent), transparent 42%), radial-gradient(circle at 85% 70%, color-mix(in srgb, white 18%, transparent), transparent 40%)",
          }}
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--brand-soft) 80%, transparent), transparent 45%)",
          }}
        />
      )}
      <SectionWrapper className="relative z-[1]">
        {showHeader ? (
          <header className="mb-10 flex max-w-3xl flex-col gap-3 sm:mb-12">
            {eyebrowSlot != null ? (
              eyebrowSlot
            ) : showEyebrow ? (
              <p
                className={`m-0 text-[11px] font-semibold tracking-[0.22em] uppercase ${
                  lightBand ? "text-brand" : "text-white/50"
                }`}
              >
                {eyebrow}
              </p>
            ) : null}
            {titleSlot != null ? (
              titleSlot
            ) : showTitle ? (
              <h2
                className={
                  lightBand
                    ? "section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl"
                    : "m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-4xl"
                }
              >
                {title}
              </h2>
            ) : null}
            {subtitleSlot != null ? (
              subtitleSlot
            ) : showSubtitle ? (
              <p
                className={
                  lightBand
                    ? "section-theme-muted m-0 max-w-2xl text-base leading-relaxed"
                    : "m-0 max-w-2xl text-base leading-relaxed text-white/72"
                }
              >
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

        {itemsBar}

        {items.length ? (
          <MobileCardPeekRow
            gapClassName="gap-4 sm:gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <WhyChooseItemCard
                key={item.id ?? i}
                title={item.title}
                body={item.body}
                imageUrl={item.imageUrl}
                index={i}
                variant={lightBand ? "light" : "dark"}
                preview={preview}
              />
            ))}
          </MobileCardPeekRow>
        ) : (
          emptyState
        )}

        {footer}
      </SectionWrapper>
    </section>
  );
}
