"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { SplitNarrativeUiProps } from "./lib/types";

export default function SplitNarrativeUi({
  id,
  coverImageUrl,
  title,
  subtitle,
  items = [],
  titleSlot,
  subtitleSlot,
  itemsBar = null,
  emptyState = null,
}: SplitNarrativeUiProps) {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = chapterRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = nodes.indexOf(visible.target as HTMLLIElement);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.2, 0.5, 0.8] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  const activeItem = items[active];
  const activePhoto =
    activeItem?.imageUrl ||
    coverImageUrl ||
    items[0]?.imageUrl ||
    null;

  const showHeader = Boolean(titleSlot || subtitleSlot || title || subtitle);

  return (
    <section
      id={id || undefined}
      className="section-band-shell relative w-full py-12 sm:py-16"
    >
      <SectionWrapper>
        {showHeader ? (
          <header className="mb-10 max-w-3xl sm:mb-14">
            {titleSlot ??
              (title ? (
                <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                  {title}
                </h2>
              ) : null)}
            {subtitleSlot ??
              (subtitle ? (
                <p className="section-theme-muted mt-3 mb-0 text-base">
                  {subtitle}
                </p>
              ) : null)}
          </header>
        ) : null}

        {itemsBar}

        {items.length ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="sticky top-28 overflow-hidden rounded-[1.75rem] bg-ink">
                <div className="relative aspect-[4/5] w-full">
                  {activePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={activePhoto}
                      src={activePhoto}
                      alt={mediaAlt(activeItem, "Chapter")}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--ink),var(--brand))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <div className="absolute right-5 bottom-5 left-5">
                    <p className="m-0 text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                      Chapter {String(active + 1).padStart(2, "0")}
                    </p>
                    {activeItem?.title ? (
                      <p className="mt-2 mb-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                        {activeItem.title}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <ol className="m-0 flex list-none flex-col gap-10 p-0 lg:col-span-7 lg:gap-16 lg:py-6">
              {items.map((item, i) => (
                <li
                  key={item.id}
                  ref={(el) => {
                    chapterRefs.current[i] = el;
                  }}
                  className={`transition duration-500 ${
                    active === i ? "opacity-100" : "opacity-55 lg:opacity-40"
                  }`}
                >
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={mediaAlt(item, "Chapter")}
                      className="mb-5 aspect-[16/10] w-full rounded-2xl object-cover lg:hidden"
                    />
                  ) : null}
                  <p className="m-0 mb-3 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                    {item.label || String(i + 1).padStart(2, "0")}
                  </p>
                  {item.title ? (
                    <h3 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
                      {item.title}
                    </h3>
                  ) : null}
                  {item.subtitle ? (
                    <p className="mt-2 mb-0 text-base font-medium text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  ) : null}
                  {!isRichTextEmpty(item.body) ? (
                    <CmsRichText
                      html={item.body}
                      className="section-theme-muted mt-4 text-[15px] leading-relaxed"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          emptyState
        )}
      </SectionWrapper>
    </section>
  );
}
