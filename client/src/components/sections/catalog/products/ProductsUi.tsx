import SectionWrapper from "@/components/sections/SectionWrapper";
import type { ProductsUiProps } from "./lib/types";

export default function ProductsUi({
  title,
  subtitle,
  eyebrow = "Products",
  titleSlot,
  subtitleSlot,
  children,
  id,
  className = "",
}: ProductsUiProps) {
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
              children ? "mb-8 sm:mb-10" : ""
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
        {children}
      </SectionWrapper>
    </section>
  );
}
