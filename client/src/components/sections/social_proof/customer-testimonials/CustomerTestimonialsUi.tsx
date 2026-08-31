"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useState } from "react";
import ChevronLeftSmIcon from "@/components/icons/ChevronLeftSmIcon";
import ChevronRightSmIcon from "@/components/icons/ChevronRightSmIcon";
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

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      eyebrowSlot={eyebrowSlot}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
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
    </SectionLayoutRoot>
  );
}
