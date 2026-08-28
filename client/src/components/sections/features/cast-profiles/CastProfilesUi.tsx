"use client";

import { useEffect, useRef, useState } from "react";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import SectionWrapper from "@/components/sections/SectionWrapper";
import CastProfileCard from "./CastProfileCard";
import type { CastProfilesUiProps } from "./lib/types";

/**
 * Pure cast profiles layout — scroll-reveal cards; no CMS chrome.
 */
export default function CastProfilesUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  id,
  className = "",
}: CastProfilesUiProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(showTitle || showSubtitle);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
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
              gapClassName="gap-4 sm:gap-5 lg:gap-6"
              gridClassName="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {items.map((item, i) => (
                <CastProfileCard
                  key={item.id ?? i}
                  item={item}
                  index={i}
                  featured={i === 0}
                  visible={visible}
                />
              ))}
            </MobileCardPeekRow>
          ) : (
            emptyState
          )}
        </SectionWrapper>
      </section>
    </div>
  );
}
