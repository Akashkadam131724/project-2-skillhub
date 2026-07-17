"use client";

import { useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { groupItemsByTabs } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";
import { sortActiveButtons } from "@/lib/button-types";

function tabPanelButtons(item) {
  const fromButtons = sortActiveButtons(
    Array.isArray(item?.buttons) ? item.buttons : []
  );
  if (fromButtons.length) return fromButtons;

  const href = String(item?.href || "").trim();
  if (!href) return [];

  return [
    {
      label: item?.label || "Explore",
      variant: "inverse",
      action_type: "url",
      target_url: href,
      status: true,
      sort_order: 0,
    },
  ];
}

function ChildCard({ item, onFormOpen, tone = "dark" }) {
  const photo = mediaUrl(item?.image_url);
  const buttons = tabPanelButtons(item);
  const dark = tone === "dark";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border ${
        dark
          ? "border-white/15 bg-white/5"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={mediaAlt(item, "Tab item")}
          className="aspect-[16/10] w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        {item?.title ? (
          <h4
            className={`m-0 text-base font-semibold tracking-tight ${
              dark ? "text-white" : "text-ink dark:text-white"
            }`}
          >
            {item.title}
          </h4>
        ) : null}
        {item?.subtitle ? (
          <p
            className={`mt-1 mb-0 text-sm ${
              dark ? "text-white/60" : "text-slate-500"
            }`}
          >
            {item.subtitle}
          </p>
        ) : null}
        {!isRichTextEmpty(item?.body) ? (
          <CmsRichText
            html={item.body}
            className={`mt-2 text-sm ${
              dark ? "text-white/70" : "text-slate-600 dark:text-slate-300"
            }`}
          />
        ) : null}
        {buttons.length ? (
          <SectionButtons
            buttons={buttons}
            onFormOpen={onFormOpen}
            inverted={dark}
            className="mt-auto flex flex-wrap items-center gap-2 pt-4"
          />
        ) : null}
      </div>
    </article>
  );
}

function TabButton({ item, index, active, onClick, layout }) {
  const childCount = Array.isArray(item.children) ? item.children.length : 0;
  const label = item.value || String(index + 1).padStart(2, "0");
  const title = item.title || `Feature ${index + 1}`;

  if (layout === "horizontal") {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onClick}
        className={`shrink-0 rounded-full border px-4 py-2.5 text-left transition ${
          active
            ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
            : "border-slate-200 bg-white text-ink hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        }`}
      >
        <span className="block text-[10px] font-semibold tracking-[0.16em] uppercase opacity-60">
          {label}
        </span>
        <span className="mt-0.5 block text-sm font-semibold tracking-tight">
          {title}
        </span>
      </button>
    );
  }

  if (layout === "underline") {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onClick}
        className={`shrink-0 border-b-2 px-1 pb-3 text-left transition ${
          active
            ? "border-brand text-ink dark:text-white"
            : "border-transparent text-slate-500 hover:text-ink dark:hover:text-white"
        }`}
      >
        <span className="block text-sm font-semibold tracking-tight sm:text-base">
          {title}
        </span>
        {item.subtitle ? (
          <span className="mt-0.5 block text-xs text-slate-500">
            {item.subtitle}
          </span>
        ) : null}
      </button>
    );
  }

  // vertical (default)
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? "border-ink bg-ink text-white shadow-md dark:border-white dark:bg-white dark:text-ink"
          : "border-slate-200 bg-white text-ink hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      }`}
    >
      <span className="block text-xs font-semibold tracking-[0.18em] uppercase opacity-60">
        {label}
      </span>
      <span className="mt-1 block text-base font-semibold tracking-tight">
        {title}
      </span>
      {item.subtitle ? (
        <span
          className={`mt-1 block text-sm ${
            active ? "text-white/70 dark:text-ink/60" : "text-slate-500"
          }`}
        >
          {item.subtitle}
        </span>
      ) : null}
      {childCount ? (
        <span
          className={`mt-2 inline-block text-[11px] font-semibold tracking-wide uppercase ${
            active ? "text-white/50 dark:text-ink/45" : "text-slate-400"
          }`}
        >
          {childCount} item{childCount === 1 ? "" : "s"}
        </span>
      ) : null}
    </button>
  );
}

function Panel({ current, childItems = [], onFormOpen, layout }) {
  const photo = mediaUrl(current?.image_url);
  const panelButtons = tabPanelButtons(current);
  const hasChildren = childItems.length > 0;
  const lightPanel = layout === "underline";

  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border shadow-lg ${
        lightPanel
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
          : "border-slate-200 bg-slate-950 dark:border-slate-800"
      }`}
    >
      {(photo || current?.title) && !lightPanel ? (
        <div className="relative aspect-[16/10]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo}
              src={photo}
              alt={mediaAlt(current, "Feature")}
              className="absolute inset-0 h-full w-full object-cover transition duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--ink),var(--brand))]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            {current?.title ? (
              <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
                {current.title}
              </h3>
            ) : null}
            {!isRichTextEmpty(current?.body) ? (
              <CmsRichText
                html={current.body}
                className="mt-3 max-w-xl text-sm text-white/75"
              />
            ) : null}
            {panelButtons.length ? (
              <SectionButtons
                buttons={panelButtons}
                onFormOpen={onFormOpen}
                inverted
                className="mt-5 flex flex-wrap items-center gap-3"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {lightPanel ? (
        photo ? (
          <div className="relative aspect-[16/10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={photo}
              src={photo}
              alt={mediaAlt(current, "Feature")}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              {current?.title ? (
                <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
                  {current.title}
                </h3>
              ) : null}
              {!isRichTextEmpty(current?.body) ? (
                <CmsRichText
                  html={current.body}
                  className="mt-3 max-w-xl text-sm text-white/75"
                />
              ) : null}
              {panelButtons.length ? (
                <SectionButtons
                  buttons={panelButtons}
                  onFormOpen={onFormOpen}
                  inverted
                  className="mt-5 flex flex-wrap items-center gap-3"
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="px-6 py-6 sm:px-8">
            {current?.title ? (
              <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink sm:text-3xl dark:text-white">
                {current.title}
              </h3>
            ) : null}
            {!isRichTextEmpty(current?.body) ? (
              <CmsRichText
                html={current.body}
                className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300"
              />
            ) : null}
            {panelButtons.length ? (
              <SectionButtons
                buttons={panelButtons}
                onFormOpen={onFormOpen}
                className="mt-5 flex flex-wrap items-center gap-3"
              />
            ) : null}
          </div>
        )
      ) : null}

      {hasChildren ? (
        <div
          className={`border-t px-4 py-5 sm:px-6 sm:py-6 ${
            lightPanel
              ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
              : "border-white/10 bg-slate-950"
          }`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {childItems.map((child, i) => (
              <ChildCard
                key={child._id || child.id || i}
                item={child}
                onFormOpen={onFormOpen}
                tone={lightPanel ? "light" : "dark"}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Shared tabs section — flat items[] with item_type "tab" | "item" + parent_id.
 *
 * @param {"vertical"|"horizontal"|"underline"} layout
 */
export default function TabsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "feature_tabs",
  layout = "vertical",
  cmsMode,
  onEditField,
  onFormOpen,
  ...frameProps
}) {
  const tabs = groupItemsByTabs(mappingItems);
  const [active, setActive] = useState(0);
  const current = tabs[Math.min(active, Math.max(tabs.length - 1, 0))];
  const children = Array.isArray(current?.children) ? current.children : [];

  if (!tabs.length && !cmsMode) return null;

  const tabListClass =
    layout === "vertical"
      ? "flex flex-col gap-2"
      : layout === "underline"
        ? "flex gap-6 overflow-x-auto border-b border-slate-200 dark:border-slate-800"
        : "flex gap-2 overflow-x-auto pb-1";

  const shell =
    layout === "vertical" ? (
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div role="tablist" aria-label="Features" className={tabListClass}>
            {tabs.map((item, i) => (
              <TabButton
                key={item._id || item.id || i}
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
          <Panel
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
            <TabButton
              key={item._id || item.id || i}
              item={item}
              index={i}
              active={i === active}
              layout={layout}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <Panel
          current={current}
          childItems={children}
          onFormOpen={onFormOpen}
          layout={layout}
        />
      </div>
    );

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={tabs.length}
      />
      {tabs.length ? (
        shell
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
