"use client";

import { SectionLayoutRoot } from "@/components/sections/layout";

import { useState } from "react";
import TabsPanel from "./TabsPanel";
import TabsTabButton from "./TabsTabButton";
import type { TabsLayout, TabsNestedUiProps } from "./lib/types";

/** Shared nested tabs layout — vertical, horizontal, or underline. */
export default function TabsNestedUi({
  layout,
  title,
  subtitle,
  eyebrow,
  eyebrowSlot,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  tabs = [],
  preview = false,
  onFormOpen,
  id,
  className = "",
}: TabsNestedUiProps) {
  const [active, setActive] = useState(0);
  const current = tabs[Math.min(active, Math.max(tabs.length - 1, 0))];
  const children = Array.isArray(current?.children) ? current.children : [];

  const tabListClass =
    layout === "vertical"
      ? "section-tabs-list section-tabs-list--vertical"
      : layout === "underline"
        ? "section-tabs-list section-tabs-list--underline"
        : "section-tabs-list section-tabs-list--horizontal";

  const shell =
    layout === "vertical" ? (
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div role="tablist" aria-label="Features" className={tabListClass}>
            {tabs.map((item, i) => (
              <TabsTabButton
                key={item.id || i}
                item={item}
                index={i}
                active={i === active}
                layout={layout}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-8">
          <TabsPanel
            current={current}
            childItems={children}
            onFormOpen={onFormOpen}
            layout={layout}
          />
        </div>
      </div>
    ) : (
      <div className="space-y-6">
        <div role="tablist" aria-label="Features" className={tabListClass}>
          {tabs.map((item, i) => (
            <TabsTabButton
              key={item.id || i}
              item={item}
              index={i}
              active={i === active}
              layout={layout}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <TabsPanel
          current={current}
          childItems={children}
          onFormOpen={onFormOpen}
          layout={layout}
        />
      </div>
    );

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
      items={tabs}
      hasBodyContent={Boolean(tabs.length)}
    >
{tabs.length ? shell : emptyState}
    </SectionLayoutRoot>
  );
}
