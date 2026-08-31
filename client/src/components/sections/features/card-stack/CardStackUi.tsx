"use client";
import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { CardStackUiProps } from "./lib/types";

/**
 * Sticky card stack on scroll — intersection observer tracks active card.
 */
export default function CardStackUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  id,
  className = "",
}: CardStackUiProps) {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = nodes.indexOf(top.target as HTMLLIElement);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.25, 0.5, 0.75] }
    );
    nodes.forEach((n) => {
      if (n) io.observe(n);
    });
    return () => io.disconnect();
  }, [items.length]);

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      items={items}
    >
      {items.length ? (
        <div className="relative mx-auto max-w-3xl pb-8">
          <ul className="m-0 list-none p-0">
            {items.map((item, i) => {
              const scale = 1 - Math.max(0, active - i) * 0.04;
              const isPast = i < active;
              return (
                <li
                  key={item.id ?? i}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="sticky top-24 mb-6 sm:top-28 sm:mb-8"
                  style={{ zIndex: i + 1 }}
                >
                  <article
                    data-section-surface="light-card"
                    data-light-surface=""
                    className="section-light-card overflow-hidden rounded-[1.5rem] section-ui-card border shadow-[0_20px_60px_-28px_rgba(11,31,77,0.35)] transition duration-500"
                    style={{
                      transform: `scale(${Math.max(scale, 0.88)})`,
                      opacity: isPast ? 0.85 : 1,
                    }}
                  >
                    <div className="grid sm:grid-cols-5">
                      <div className="relative aspect-[4/3] sm:col-span-2 sm:aspect-auto sm:min-h-[280px]">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={mediaAlt(item, "Card")}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--ink),var(--brand))]" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-6 sm:col-span-3 sm:p-8">
                        <p className="m-0 mb-2 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                          {item.value || String(i + 1).padStart(2, "0")}
                        </p>
                        {item.title ? (
                          <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight section-theme-heading sm:text-3xl">
                            {item.title}
                          </h3>
                        ) : null}
                        {item.subtitle ? (
                          <p className="mt-2 mb-0 text-sm font-medium section-theme-muted">
                            {item.subtitle}
                          </p>
                        ) : null}
                        {!isRichTextEmpty(item.body) ? (
                          <CmsRichText
                            html={item.body}
                            className="mt-4 text-[15px] leading-relaxed section-theme-muted"
                          />
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        emptyState
      )}
    </SectionLayoutRoot>
  );
}
