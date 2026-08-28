"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import BentoGridCell from "./BentoGridCell";
import type { BentoGridUiProps } from "./lib/types";

const SPAN = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
];

/**
 * Pure bento mosaic layout — scroll-reveal cells; no CMS chrome.
 */
export default function BentoGridUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  id,
  className = "",
}: BentoGridUiProps) {
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
      { threshold: 0.12 }
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
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:grid-flow-dense lg:grid-cols-4 lg:gap-4">
              {items.map((item, i) => (
                <li key={item.id ?? i} className={SPAN[i % SPAN.length]}>
                  <BentoGridCell item={item} index={i} visible={visible} />
                </li>
              ))}
            </ul>
          ) : (
            emptyState
          )}
        </SectionWrapper>
      </section>
    </div>
  );
}
