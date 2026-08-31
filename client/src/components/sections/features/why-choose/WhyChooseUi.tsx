import { SectionLayoutRoot } from "@/components/sections/layout";
import { sectionClassNames } from "@/lib/layout/section-layout-system";
import WhyChooseItemCard from "./WhyChooseItemCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
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

  const darkTitleClass =
    "m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-4xl";
  const darkSubtitleClass =
    "m-0 max-w-2xl text-base leading-relaxed text-white/72";

  const decor = lightBand ? (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--brand-soft) 80%, transparent), transparent 45%)",
      }}
    />
  ) : (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand) 45%, transparent), transparent 42%), radial-gradient(circle at 85% 70%, color-mix(in srgb, white 18%, transparent), transparent 40%)",
      }}
    />
  );

  return (
    <SectionLayoutRoot
      id={id}
      className={sectionClassNames(
        lightBand ? "text-ink" : "text-white",
        className
      )}
      wrapperClassName="relative z-[1]"
      decor={decor}
      eyebrow={eyebrow}
      eyebrowSlot={eyebrowSlot}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      titleClassName={lightBand ? "" : darkTitleClass}
      subtitleClassName={lightBand ? "" : darkSubtitleClass}
      eyebrowClassName={lightBand ? "" : "text-white/50"}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
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
    </SectionLayoutRoot>
  );
}
