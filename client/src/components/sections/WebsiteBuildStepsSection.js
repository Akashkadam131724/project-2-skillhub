"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/** Numbered build guide with an editorial side panel. */
export default function WebsiteBuildStepsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "website_build_steps",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <div className="bg-white dark:bg-slate-950">
      <SectionFrame title={section_title} subtitle={sub_title} cmsMode={cmsMode} onEditField={onEditField} {...frameProps}>
        <CmsSectionItemsBar sectionKey={section_key} cmsMode={cmsMode} onEditField={onEditField} itemCount={items.length} />
        {items.length ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-[1.75rem] bg-[#111] p-6 text-white sm:p-8">
                <p className="m-0 text-xs font-semibold tracking-[0.24em] text-white/45 uppercase">Build flow</p>
                <p className="mt-5 mb-0 font-[family-name:var(--font-display)] text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
                  From idea to live site.
                </p>
                <div className="mt-8 grid gap-3">
                  <div className="h-20 rounded-2xl bg-white/10" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-2xl bg-white/15" />
                    <div className="h-24 rounded-2xl bg-brand/70" />
                  </div>
                  <div className="h-3 w-2/3 rounded-full bg-white/20" />
                  <div className="h-3 w-1/2 rounded-full bg-white/15" />
                </div>
              </div>
            </div>
            <ol className="m-0 list-none p-0 lg:col-span-7">
              {items.map((item, i) => (
                <li key={item._id || item.id || i} className="border-t border-slate-200 py-7 first:border-t-0 first:pt-0 dark:border-slate-800">
                  <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
                    <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-semibold text-slate-300 dark:text-slate-700">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div>
                      {item.title ? <h3 className="m-0 text-xl font-semibold tracking-tight text-ink dark:text-white">{item.title}</h3> : null}
                      {item.subtitle ? <p className="mt-1 mb-0 text-sm font-medium text-brand">{item.subtitle}</p> : null}
                      {!isRichTextEmpty(item.body) ? <CmsRichText html={item.body} className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300" /> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
