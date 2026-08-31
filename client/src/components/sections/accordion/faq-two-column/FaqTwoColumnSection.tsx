"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
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
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        onDarkBand: darkBand,
        footerClassName: "mt-2 sm:mt-4",
      })}
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
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}

    />
  );
}
