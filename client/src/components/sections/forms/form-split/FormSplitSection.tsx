"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { SectionLightCard } from "@/components/sections/shared/design";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import FormSplitUi from "./FormSplitUi";
import { normalizeFormContentSide } from "./lib/content-side";
import { resolveFormHighlightUiItems } from "./lib/map";
import { isFormSplitPlacementShowable } from "./lib/placement";
import type { FormSplitSectionProps } from "./lib/types";

export default function FormSplitSection({
  section_title,
  sub_title,
  data = {},
  items: mappingItems,
  section_key = "form_split",
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
  id,
}: FormSplitSectionProps) {
  const body = data?.body || "";
  const contentSide = normalizeFormContentSide(data);
  const items = resolveFormHighlightUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  const formTitle = data?.form_title || "Send a message";
  const formSubtitle = data?.form_subtitle || "";
  const formKey = data?.form_key || "lead";
  const submitLabel = data?.submit_label || "Submit";

  if (
    !isFormSplitPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        items: mappingItems,
        section_key,
      },
      cmsMode
    )
  ) {
    return null;
  }

  return (
    <FormSplitUi
      id={id}
      contentSide={contentSide}
      cmsMode={cmsMode}
      formTitle={formTitle}
      formSubtitle={formSubtitle}
      formKey={formKey}
      submitLabel={submitLabel}
      successMessage={data?.success_message}
      contentSideSlot={
        cmsMode ? (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Content column
            </span>
            {(["left", "right"] as const).map((side) => (
              <button
                key={side}
                type="button"
                onClick={() =>
                  onEditField?.("form_content_side", { preset: side })
                }
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  contentSide === side
                    ? "bg-brand text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {side}
              </button>
            ))}
            <span className="text-[11px] text-slate-400">
              Form on {contentSide === "left" ? "right" : "left"}
            </span>
          </div>
        ) : undefined
      }
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title || cmsMode ? (
            <h2
              className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl`}
            >
              {section_title || (cmsMode ? "Add title…" : null)}
            </h2>
          ) : null}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title || cmsMode ? (
            <p
              className={`${DS_TEXT.muted} mt-4 mb-0 text-base leading-relaxed sm:text-lg`}
            >
              {sub_title || (cmsMode ? "Add subtitle…" : null)}
            </p>
          ) : null}
        </CmsEditable>
      }
      bodySlot={
        !isRichTextEmpty(body) || cmsMode ? (
          <CmsEditable
            cmsMode={cmsMode}
            field="body"
            label="Body"
            onEditField={onEditField}
          >
            <CmsRichText
              html={body}
              className={`${DS_TEXT.muted} mt-4 text-sm leading-relaxed`}
              empty={
                cmsMode ? (
                  <p className={`${DS_TEXT.placeholder} m-0 italic`}>
                    Optional body…
                  </p>
                ) : null
              }
            />
          </CmsEditable>
        ) : undefined
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="mt-6"
        />
      }
      itemsBar={
        items.length || cmsMode ? (
          <CmsSectionItemsBar
            sectionKey={section_key}
            cmsMode={cmsMode}
            onEditField={onEditField}
            itemCount={items.length}
            className="mt-6"
          />
        ) : undefined
      }
      highlightsSlot={
        items.length || cmsMode ? (
          <ul className="m-0 mt-4 grid list-none gap-3 p-0">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <SectionLightCard className="rounded-2xl px-4 py-3 shadow-none">
                  {item.title ? (
                    <span
                      className={`text-sm font-semibold ${DS_TEXT.heading}`}
                    >
                      {item.title}
                    </span>
                  ) : null}
                  {item.subtitle ? (
                    <span className={`mt-1 block text-sm ${DS_TEXT.muted}`}>
                      {item.subtitle}
                    </span>
                  ) : null}
                </SectionLightCard>
              </li>
            ))}
          </ul>
        ) : undefined
      }
    />
  );
}
