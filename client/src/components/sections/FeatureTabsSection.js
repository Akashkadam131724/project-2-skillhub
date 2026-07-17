"use client";

import { useState } from "react";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Feature tabs + live preview panel — Launch UI / Magic UI style showcase.
 */
export default function FeatureTabsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "feature_tabs",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const [active, setActive] = useState(0);
  const current = items[Math.min(active, Math.max(items.length - 1, 0))];
  const photo = mediaUrl(current?.image_url);

  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div
              role="tablist"
              aria-label="Features"
              className="flex flex-col gap-2"
            >
              {items.map((item, i) => {
                const on = i === active;
                return (
                  <button
                    key={item._id || item.id || i}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(i)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      on
                        ? "border-ink bg-ink text-white shadow-md dark:border-white dark:bg-white dark:text-ink"
                        : "border-slate-200 bg-white text-ink hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    }`}
                  >
                    <span className="block text-xs font-semibold tracking-[0.18em] uppercase opacity-60">
                      {item.value || String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-base font-semibold tracking-tight">
                      {item.title || `Feature ${i + 1}`}
                    </span>
                    {item.subtitle ? (
                      <span
                        className={`mt-1 block text-sm ${
                          on ? "text-white/70 dark:text-ink/60" : "text-slate-500"
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 shadow-lg dark:border-slate-800">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
