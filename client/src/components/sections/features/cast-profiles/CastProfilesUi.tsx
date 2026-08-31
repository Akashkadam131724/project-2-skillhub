"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import CastProfileCard from "./CastProfileCard";
import type { CastProfilesUiProps } from "./lib/types";

/**
 * Pure cast profiles layout — scroll-reveal cards; no CMS chrome.
 */
export default function CastProfilesUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  id,
  className = "",
}: CastProfilesUiProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
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
              gapClassName="gap-4 sm:gap-5 lg:gap-6"
              gridClassName="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {items.map((item, i) => (
                <CastProfileCard
                  key={item.id ?? i}
                  item={item}
                  index={i}
                  featured={i === 0}
                  visible={visible}
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
