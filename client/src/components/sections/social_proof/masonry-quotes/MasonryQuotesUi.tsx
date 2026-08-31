"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import { useEffect, useRef, useState } from "react";
import MasonryQuoteItemCard from "./MasonryQuoteItemCard";
import type { MasonryQuotesUiProps } from "./lib/types";

export default function MasonryQuotesUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: MasonryQuotesUiProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(preview);

  useEffect(() => {
    if (preview) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [preview]);

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
      footer={footer}
      items={items}
    >
{items.length ? (
          <ul className="m-0 columns-1 gap-4 p-0 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <MasonryQuoteItemCard
                key={item.id ?? i}
                item={item}
                preview={preview}
                visible={visible}
                revealDelayMs={Math.min(i, 8) * 60}
              />
            ))}
          </ul>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
