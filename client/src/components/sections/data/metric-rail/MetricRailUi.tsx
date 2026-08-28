"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type { MetricRailUiProps } from "./lib/types";

/**
 * Pure metric-rail layout — scroll-reveal tiles; no CMS imports.
 */
export default function MetricRailUi({
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
}: MetricRailUiProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(eyebrow || showTitle || showSubtitle);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
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
                items.length || itemsBar || emptyState || footer
                  ? "mb-8 sm:mb-10"
                  : ""
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
            <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-4 sm:gap-8">
              {items.map((item, i) => (
                <li
                  key={item.id ?? i}
                  className={`text-center transition duration-700 ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <p className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight section-theme-heading sm:text-4xl">
                    {item.value || "—"}
                  </p>
                  <p className="section-theme-muted mt-1 mb-0 text-sm">
                    {item.label || (preview ? "Label" : "")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            emptyState
          )}

          {footer}
        </SectionWrapper>
      </section>
    </div>
  );
}
