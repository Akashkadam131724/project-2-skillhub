"use client";
import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
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
      <SectionLayoutRoot
        id={id}
        className={className}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        titleSlot={titleSlot}
        subtitleSlot={subtitleSlot}
        itemsBar={itemsBar}
        emptyState={emptyState}
        footer={footer}
        items={items}
      >
        {items.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-4 sm:gap-8">
            {items.map((item, i) => (
              <li
                key={item.id ?? i}
                className={`text-center transition duration-700 ${visible
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
      </SectionLayoutRoot>
    </div>
  );
}
