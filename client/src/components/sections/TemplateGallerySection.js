"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

/** Template-forward gallery with oversized editorial cards. */
export default function TemplateGallerySection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "template_gallery",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <div className="bg-[#f4efe8] text-[#111] dark:bg-slate-950 dark:text-white">
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
          <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const img = mediaUrl(item.image_url);
              const large = i % 5 === 0;
              return (
                <li key={item._id || item.id || i} className={large ? "md:col-span-2" : ""}>
                  <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-white/10">
                    <div className={`relative overflow-hidden bg-slate-200 ${large ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={mediaAlt(item, "Template")} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(135deg,#ded6c8,#aab8a4)]" />
                      )}
                    </div>
                    <div className="p-5 sm:p-6">
                      {item.value ? <p className="m-0 mb-2 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">{item.value}</p> : null}
                      {item.title ? <h3 className="m-0 text-xl font-semibold tracking-tight text-ink dark:text-white">{item.title}</h3> : null}
                      {item.subtitle ? <p className="mt-2 mb-0 text-sm text-slate-500 dark:text-slate-400">{item.subtitle}</p> : null}
                      {!isRichTextEmpty(item.body) ? <CmsRichText html={item.body} className="mt-3 text-sm text-slate-600 dark:text-slate-300" /> : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}
      </SectionFrame>
    </div>
  );
}
