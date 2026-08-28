"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import FaqTwoColumnUi from "./FaqTwoColumnUi";
import { faqDarkBand, resolveFaqUiItems } from "../shared/lib/map";
import type { FaqSectionProps } from "../shared/lib/types";
import { normalizeFaqHeaderSide } from "./lib/map";

/**
 * CMS-only two-column FAQ adapter → {@link FaqTwoColumnUi}.
 * Public pages use {@link FaqTwoColumnPublicSection}.
 */
export default function FaqTwoColumnSection({
  section_title,
  sub_title,
  data = {},
  items: mappingItems,
  section_key = "faq_two_column",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
  id,
}: FaqSectionProps) {
  const items = resolveFaqUiItems(section_key, mappingItems, { cmsMode: true });
  const headerSide = normalizeFaqHeaderSide(data);
  const darkBand = faqDarkBand({
    section_theme,
    sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <FaqTwoColumnUi
      id={id}
      eyebrow="FAQ"
      headerSide={headerSide}
      darkBand={darkBand}
      preview
      items={items}
      headerControls={
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Title column
          </span>
          {(["left", "right"] as const).map((side) => (
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
      }
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight section-theme-heading sm:text-4xl">
              {section_title}
            </h2>
          ) : (
            <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight section-theme-heading sm:text-4xl">
              <span className="section-theme-placeholder italic">
                Add title…
              </span>
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p className="m-0 text-base leading-relaxed section-theme-muted">
              {sub_title}
            </p>
          ) : (
            <p className="m-0 text-base leading-relaxed section-theme-muted">
              <span className="section-theme-placeholder italic">
                Add subtitle…
              </span>
            </p>
          )}
        </CmsEditable>
      }
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted={darkBand}
          className="mt-2 sm:mt-4"
        />
      }
    />
  );
}
