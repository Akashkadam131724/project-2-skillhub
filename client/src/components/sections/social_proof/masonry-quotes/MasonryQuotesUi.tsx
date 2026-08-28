"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import MasonryQuoteItemCard from "./MasonryQuoteItemCard";
import type { MasonryQuotesUiProps } from "./lib/types";

export default function MasonryQuotesUi({
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
}: MasonryQuotesUiProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(preview);

  useEffect(() => {
    if (preview) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [preview]);

  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(showTitle || showSubtitle);

  return (
    <section
      ref={ref}
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
          <ul className="m-0 columns-1 gap-4 p-0 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <MasonryQuoteItemCard
                key={item.id ?? i}
                item={item}
                preview={preview}
                visible={visible}
                revealDelayMs={Math.min(i, 8) * 60}
              />
            ))}
          </ul>
        ) : (
          emptyState
        )}

        {footer}
      </SectionWrapper>
    </section>
  );
}
