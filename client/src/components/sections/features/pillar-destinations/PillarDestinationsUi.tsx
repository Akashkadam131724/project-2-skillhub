"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import FeatureCardPlaceholder from "@/components/sections/features/cards/FeatureCardPlaceholder";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type {
  PillarDestinationsUiItem,
  PillarDestinationsUiProps,
} from "./lib/types";

function PillarCard({
  item,
  index,
  visible,
  preview = false,
}: {
  item: PillarDestinationsUiItem;
  index: number;
  visible: boolean;
  preview?: boolean;
}) {
  const delay = Math.min(index, 5) * 90;
  const inner = (
    <>
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.imageAlt || "Destination"}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--ink)_0%,var(--brand)_100%)]" />
      )}
      <div className="absolute inset-0 bg-ink/55 transition duration-500 group-hover:bg-ink/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative z-[1] flex h-full w-full flex-col justify-end p-6 sm:p-8">
        <p className="m-0 mb-3 font-[family-name:var(--font-display)] text-5xl font-semibold text-white/25 sm:text-6xl">
          {String(index + 1).padStart(2, "0")}
        </p>
        {item.title || preview ? (
          <h3 className="m-0 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {item.title ||
              (preview ? (
                <FeatureCardPlaceholder>Pillar title…</FeatureCardPlaceholder>
              ) : null)}
          </h3>
        ) : null}
        {item.subtitle ? (
          <p className="mt-2 mb-0 text-sm font-medium text-white/70">
            {item.subtitle}
          </p>
        ) : null}
        {!isRichTextEmpty(item.body) || preview ? (
          <CmsRichText
            html={item.body}
            className="pillar-destinations-card__body mt-3 text-sm leading-relaxed text-white/65"
            empty={
              preview ? (
                <p className="pillar-destinations-card__body mt-3 mb-0 text-sm leading-relaxed text-white/50 italic">
                  Description…
                </p>
              ) : null
            }
          />
        ) : null}
        {item.href ? (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Explore
            <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </>
  );

  const className = `group pillar-destinations-card relative flex h-full min-h-[22rem] overflow-hidden rounded-[1.75rem] transition duration-700 ease-out sm:min-h-[440px] ${
    visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  if (item.href) {
    return (
      <a
        href={item.href}
        data-section-surface="dark-overlay"
        data-always-light-text=""
        className={className}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {inner}
      </a>
    );
  }

  return (
    <article
      data-section-surface="dark-overlay"
      data-always-light-text=""
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {inner}
    </article>
  );
}

/**
 * Pure pillar destinations layout — scroll-reveal cards; no CMS chrome.
 */
export default function PillarDestinationsUi({
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
}: PillarDestinationsUiProps) {
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
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      items={items}
    >
{items.length ? (
            <MobileCardPeekRow
              gridFrom="md"
              gapClassName="gap-4 lg:gap-5"
              gridClassName="md:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((item, i) => (
                <PillarCard
                  key={item.id ?? i}
                  item={item}
                  index={i}
                  visible={visible}
                  preview={preview}
                />
              ))}
            </MobileCardPeekRow>
          ) : (
            emptyState
          )}
    </SectionLayoutRoot>
    </div>
  );
}
