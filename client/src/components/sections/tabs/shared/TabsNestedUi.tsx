"use client";

import { useState } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
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
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showHeader = Boolean(showEyebrow || showTitle || showSubtitle);

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
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-2.5 sm:gap-3 ${
              tabs.length || itemsBar || emptyState || footer
                ? "mb-8 sm:mb-10"
                : ""
            }`}
          >
            {eyebrowSlot != null ? (
              eyebrowSlot
            ) : showEyebrow ? (
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
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

        {tabs.length ? shell : emptyState}

        {footer}
      </SectionWrapper>
    </section>
  );
}
