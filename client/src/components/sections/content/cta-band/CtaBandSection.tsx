"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import CtaBandUi from "./CtaBandUi";
import { isCtaBandPlacementShowable } from "./lib/placement";
import type { CtaBandSectionProps } from "./lib/types";

export default function CtaBandSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
  id,
}: CtaBandSectionProps) {
  const body = data?.body || "";

  if (
    !isCtaBandPlacementShowable(
      { section_title, sub_title, data, buttons, button_title, target_url },
      cmsMode
    )
  ) {
    return null;
  }

  return (
    <CtaBandUi
      id={id}
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title || cmsMode ? (
            <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {section_title || (cmsMode ? "Call to action" : null)}
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
            <p className="mt-4 mb-0 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {sub_title || (cmsMode ? "Supporting line" : null)}
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
              className="mt-3 max-w-xl text-sm leading-relaxed text-white/65"
              empty={
                cmsMode ? (
                  <p className="m-0 text-white/35 italic">Optional body…</p>
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
          className="mt-8 justify-center"
        />
      }
    />
  );
}
