"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { resolveItemsForSection } from "@/lib/item-types";

/** Domain search mock band inspired by website-builder homepages. */
export default function DomainSearchBandSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "domain_search_band",
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const domain = data?.domain || "yourbrand.com";
  if (!section_title && !sub_title && !items.length && !cmsMode) return null;

  return (
    <section className="bg-[#10100e] py-12 text-white sm:py-16">
      <SectionWrapper>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <CmsEditable cmsMode={cmsMode} field="section_title" label="Title" onEditField={onEditField}>
              {section_title || cmsMode ? <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">{section_title || "Find your domain"}</h2> : null}
            </CmsEditable>
            <CmsEditable cmsMode={cmsMode} field="sub_title" label="Subtitle" onEditField={onEditField}>
              {sub_title || cmsMode ? <p className="mt-3 mb-0 max-w-md text-base text-white/65">{sub_title || "Search for a name that makes your idea official."}</p> : null}
            </CmsEditable>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[1.5rem] bg-white p-3 text-ink shadow-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <span className="text-slate-400">https://</span>
                <span className="min-w-0 flex-1 truncate text-lg font-semibold">{domain}</span>
                <span className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Search</span>
              </div>
              {items.length ? (
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                  {items.map((item, i) => (
                    <li key={item._id || item.id || i} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {item.value || item.label || item.title}
                    </li>
                  ))}
                </ul>
              ) : cmsMode ? (
                <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
              ) : null}
            </div>
            <CmsSectionItemsBar sectionKey={section_key} cmsMode={cmsMode} onEditField={onEditField} itemCount={items.length} className="mt-4 [&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white" />
          </div>
        </div>
        <SectionButtonsFooter buttons={buttons} button_title={button_title} target_url={target_url} cmsMode={cmsMode} onEditField={onEditField} onFormOpen={onFormOpen} inverted className="mt-8" />
      </SectionWrapper>
    </section>
  );
}
