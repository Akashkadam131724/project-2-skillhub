"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { SectionLightCard } from "@/components/sections/shared/design";
import {
  DS_RADIUS,
  DS_TYPE,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
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
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        cmsMode,
      })}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        footerClassName: "mt-6",
      })}
      contentSideSlot={
        cmsMode ? (
          <div
            className={sectionClassNames(
              DS_RADIUS.panel,
              "mb-4 flex flex-wrap items-center gap-2 border border-dashed border-slate-200 bg-slate-50/80 p-2"
            )}
          >
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
              className={sectionClassNames(DS_TYPE.body, "text-sm")}
              empty={
                cmsMode ? (
                  <p
                    className={sectionClassNames(
                      DS_TYPE.placeholderSubtitle,
                      "m-0"
                    )}
                  >
                    Optional body…
                  </p>
                ) : null
              }
            />
          </CmsEditable>
        ) : undefined
      }
      highlightsSlot={
        items.length || cmsMode ? (
          <ul className="m-0 mt-4 grid list-none gap-3 p-0">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <SectionLightCard
                  className={sectionClassNames(
                    DS_RADIUS.nested,
                    "px-4 py-3 shadow-none"
                  )}
                >
                  {item.title ? (
                    <span
                      className={sectionClassNames(
                        DS_TYPE.body,
                        "text-sm font-semibold"
                      )}
                    >
                      {item.title}
                    </span>
                  ) : null}
                  {item.subtitle ? (
                    <span
                      className={sectionClassNames(
                        DS_TYPE.body,
                        "mt-1 block text-sm"
                      )}
                    >
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
