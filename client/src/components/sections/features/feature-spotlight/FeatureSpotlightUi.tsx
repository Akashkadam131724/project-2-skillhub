"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import FeatureCardPlaceholder from "@/components/sections/features/cards/FeatureCardPlaceholder";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type {
  FeatureSpotlightUiItem,
  FeatureSpotlightUiProps,
} from "./lib/types";

function SpotlightCard({
  item,
  index,
  visible,
  preview = false,
}: {
  item: FeatureSpotlightUiItem;
  index: number;
  visible: boolean;
  preview?: boolean;
}) {
  const delay = Math.min(index, 5) * 80;

  return (
    <article
      className={`group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white transition duration-700 ease-out dark:border-slate-800 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.imageAlt || "Feature spotlight"}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#0b1f4d,#1b4de4)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
      <div className="relative z-[1] p-5 sm:p-6">
        {item.value ? (
          <p className="m-0 mb-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {item.value}
          </p>
        ) : null}
        {item.title || preview ? (
          <h3 className="m-0 text-lg font-semibold tracking-tight text-white sm:text-xl">
            {item.title ||
              (preview ? (
                <FeatureCardPlaceholder>Spotlight title…</FeatureCardPlaceholder>
              ) : null)}
          </h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-1 mb-0 text-sm font-medium text-white/70">
            {item.subtitle}
          </p>
        ) : null}
        {!isRichTextEmpty(item.body) || preview ? (
          <CmsRichText
            html={item.body}
            className="mt-3 text-sm leading-relaxed text-white/75"
            empty={
              preview ? (
                <p className="mt-3 mb-0 text-sm leading-relaxed text-white/50 italic">
                  Description…
                </p>
              ) : null
            }
          />
        ) : null}
      </div>
    </article>
  );
}

/**
 * Pure feature-spotlight layout — scroll-reveal grid; no CMS chrome.
 */
export default function FeatureSpotlightUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  preview = false,
  id,
  className = "",
}: FeatureSpotlightUiProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = showTitle || showSubtitle;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
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
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:auto-rows-[minmax(260px,1fr)] lg:grid-cols-3 lg:auto-rows-[minmax(240px,1fr)] lg:gap-5">
              {items.map((item, i) => (
                <li
                  key={item.id ?? i}
                  className={`h-full ${
                    item.large
                      ? "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
                      : ""
                  }`}
                >
                  <SpotlightCard
                    item={item}
                    index={i}
                    visible={visible}
                    preview={preview}
                  />
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
