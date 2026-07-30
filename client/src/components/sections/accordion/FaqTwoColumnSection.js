"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { FaqItemCard } from "@/components/sections/SectionItemCard";
import SectionWrapper from "../SectionWrapper";
import { resolveItemsForSection } from "@/lib/item-types";
import { isPlacementDarkBand } from "@/lib/section-theme";

/** @returns {"left"|"right"} */
export function normalizeFaqHeaderSide(data) {
  const raw = String(
    data?.header_side || data?.title_side || "left"
  )
    .toLowerCase()
    .trim();
  return raw === "right" ? "right" : "left";
}

export default function FaqTwoColumnSection({
  section_title,
  sub_title,
  data = {},
  items: mappingItems,
  section_key = "faq_two_column",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const headerSide = normalizeFaqHeaderSide(data);
  const darkBand = isPlacementDarkBand({
    section_theme,
    sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (!items.length && !cmsMode) return null;

  const headerCol = (
    <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-[calc(var(--site-header-h,4.25rem)+5rem)] lg:self-start">
      {cmsMode ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Title column
          </span>
          {(["left", "right"]).map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => onEditField?.("faq_header_side", { preset: side })}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                headerSide === side
                  ? "bg-brand text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {side}
            </button>
          ))}
          <span className="text-[11px] text-slate-400">
            FAQs on {headerSide === "left" ? "right" : "left"}
          </span>
        </div>
      ) : null}
      <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
        FAQ
      </p>
      <CmsEditable
        cmsMode={cmsMode}
        field="section_title"
        label="Title"
        onEditField={onEditField}
      >
        {section_title || cmsMode ? (
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight section-theme-heading sm:text-4xl">
            {section_title || (
              <span className="section-theme-placeholder italic">
                Add title…
              </span>
            )}
          </h2>
        ) : null}
      </CmsEditable>
      <CmsEditable
        cmsMode={cmsMode}
        field="sub_title"
        label="Subtitle"
        onEditField={onEditField}
      >
        {sub_title || cmsMode ? (
          <p className="m-0 text-base leading-relaxed section-theme-muted">
            {sub_title || (
              <span className="section-theme-placeholder italic">
                Add subtitle…
              </span>
            )}
          </p>
        ) : null}
      </CmsEditable>
      <SectionButtonsFooter
        buttons={buttons}
        button_title={button_title}
        target_url={target_url}
        cmsMode={cmsMode}
        onEditField={onEditField}
        onFormOpen={onFormOpen}
        inverted={darkBand}
        className="mt-2 sm:mt-4"
      />
    </div>
  );

  const faqCol = (
    <div className="min-w-0">
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <FaqItemCard
              key={item._id || item.id || i}
              item={item}
              index={i}
              preview={cmsMode}
              onDarkBand={darkBand}
            />
          ))}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20">
      <SectionWrapper>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div
            className={`min-w-0 ${
              headerSide === "left" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            {headerCol}
          </div>
          <div
            className={`min-w-0 ${
              headerSide === "left" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {faqCol}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
