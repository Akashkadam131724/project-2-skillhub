"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { ProcessStepsUiProps } from "./lib/types";

/**
 * Pure process-steps layout — scroll-reveal rail; no CMS chrome.
 */
export default function ProcessStepsUi({
  title,
  subtitle,
  eyebrow,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  onDarkBand = false,
  preview = false,
  id,
  className = "",
}: ProcessStepsUiProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

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
            <ol className="relative m-0 grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <div
                aria-hidden
                className={`pointer-events-none absolute top-7 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent to-transparent lg:block ${
                  onDarkBand
                    ? "via-white/25"
                    : "via-slate-300 dark:via-slate-600"
                }`}
              />
              {items.map((item, i) => {
                const delay = Math.min(i, 6) * 90;
                return (
                  <li
                    key={item.id ?? i}
                    className={`relative transition duration-700 ease-out ${
                      visible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                    style={{ transitionDelay: `${delay}ms` }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-ink font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-slate-200 lg:hidden dark:bg-slate-800" />
                    </div>
                    {item.title || preview ? (
                      <h3
                        className={`m-0 text-lg font-semibold tracking-tight ${DS_TEXT.heading} ${
                          preview && !item.title ? "italic opacity-50" : ""
                        }`}
                      >
                        {item.title || "Step title…"}
                      </h3>
                    ) : null}
                    {item.subtitle ? (
                      <p className="mt-1 mb-0 text-sm font-medium text-brand">
                        {item.subtitle}
                      </p>
                    ) : null}
                    {!isRichTextEmpty(item.body) || preview ? (
                      <CmsRichText
                        html={item.body}
                        className={`mt-2 text-sm leading-relaxed ${DS_TEXT.muted}`}
                        empty={
                          preview ? (
                            <p
                              className={`mt-2 mb-0 text-sm leading-relaxed italic opacity-50 ${DS_TEXT.muted}`}
                            >
                              Description…
                            </p>
                          ) : null
                        }
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : (
            emptyState
          )}
    </SectionLayoutRoot>
    </div>
  );
}
