"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/** Monochrome feature cards for builder capabilities: store, bookings, marketing, analytics. */
export default function BuilderFeatureCardsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "builder_feature_cards",
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
          <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-200 p-0 md:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-800">
            {items.map((item, i) => (
              <li key={item._id || item.id || i}>
                <article className="flex min-h-[280px] flex-col bg-white p-6 dark:bg-slate-900">
                  <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                    {item.value || String(i + 1).padStart(2, "0")}
                  </div>
                  {item.title ? <h3 className="m-0 text-xl font-semibold tracking-tight text-ink dark:text-white">{item.title}</h3> : null}
                  {item.subtitle ? <p className="mt-2 mb-0 text-sm font-medium text-brand">{item.subtitle}</p> : null}
                  {!isRichTextEmpty(item.body) ? <CmsRichText html={item.body} className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300" /> : null}
                  <div className="mt-auto pt-8 text-sm font-semibold text-ink dark:text-white">Learn more →</div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
