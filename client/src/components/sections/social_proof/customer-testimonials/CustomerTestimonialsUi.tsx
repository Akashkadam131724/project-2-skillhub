"use client";

import { useEffect, useState } from "react";
import ChevronLeftSmIcon from "@/components/icons/ChevronLeftSmIcon";
import ChevronRightSmIcon from "@/components/icons/ChevronRightSmIcon";
import SectionWrapper from "@/components/sections/SectionWrapper";
import TestimonialSlide from "./TestimonialSlide";
import type { CustomerTestimonialsUiProps } from "./lib/types";

export default function CustomerTestimonialsUi({
  title,
  subtitle,
  eyebrow = "Stories",
  titleSlot,
  subtitleSlot,
  eyebrowSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: CustomerTestimonialsUiProps) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (preview || count < 2) return undefined;
    const idTimer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => window.clearInterval(idTimer);
  }, [preview, count]);

  function go(delta: number) {
    if (!count) return;
    setIndex((i) => (i + delta + count) % count);
  }

  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(showEyebrow || showTitle || showSubtitle);

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex max-w-3xl flex-col gap-2.5 sm:gap-3 ${
              items.length || itemsBar || emptyState || footer
                ? "mb-8 sm:mb-10"
                : ""
            }`}
          >
            {eyebrowSlot != null ? (
              eyebrowSlot
            ) : showEyebrow ? (
              <p className="text-brand m-0 text-[11px] font-semibold tracking-[0.22em] uppercase">
                {eyebrow}
              </p>
            ) : null}
            {titleSlot != null ? (
              titleSlot
            ) : showTitle ? (
              <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
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

        {count ? (
          <div>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {items.map((item, i) => (
                  <div key={item.id ?? i} className="w-full shrink-0 px-0.5">
                    <TestimonialSlide item={item} preview={preview} />
                  </div>
                ))}
              </div>
            </div>

            {count > 1 ? (
              <div
                className="mt-8 flex items-center justify-start gap-3 sm:mt-10 sm:gap-4"
                data-section-surface="light-card"
                data-light-surface
              >
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="text-ink inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-brand hover:text-brand"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeftSmIcon />
                </button>

                <div className="flex gap-2" role="tablist">
                  {items.map((item, i) => (
                    <button
                      key={item.id ?? i}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Go to testimonial ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-2.5 rounded-full border-0 transition-all ${
                        i === index
                          ? "bg-brand w-7"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(1)}
                  className="text-ink inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-brand hover:text-brand"
                  aria-label="Next testimonial"
                >
                  <ChevronRightSmIcon />
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          emptyState
        )}

        {footer}
      </SectionWrapper>
    </section>
  );
}
