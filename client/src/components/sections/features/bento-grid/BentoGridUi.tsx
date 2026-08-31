"use client";
import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
import BentoGridCell from "./BentoGridCell";
import type { BentoGridUiProps } from "./lib/types";

const SPAN = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
];

/**
 * Pure bento mosaic layout — scroll-reveal cells; no CMS chrome.
 */
export default function BentoGridUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  id,
  className = "",
}: BentoGridUiProps) {
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
        title={title}
        subtitle={subtitle}
        titleSlot={titleSlot}
        subtitleSlot={subtitleSlot}
        itemsBar={itemsBar}
        emptyState={emptyState}
        items={items}
      >
        {items.length ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:grid-flow-dense lg:grid-cols-4 lg:gap-4">
            {items.map((item, i) => (
              <li key={item.id ?? i} className={SPAN[i % SPAN.length]}>
                <BentoGridCell item={item} index={i} visible={visible} />
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
