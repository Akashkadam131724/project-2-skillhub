"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { DS_TYPE } from "@/lib/sections/section-design-system";
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
      {...cmsSectionHeaderSlots({
        section_title: section_title || (cmsMode ? "Call to action" : undefined),
        sub_title: sub_title || (cmsMode ? "Supporting line" : undefined),
        onEditField,
        cmsMode,
        inverted: true,
        titleClassName: "text-center lg:text-5xl",
        subtitleClassName: "text-center",
      })}
      {...cmsSectionChrome({
        section_key: "cta_band",
        itemCount: 0,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        inverted: true,
        footerClassName: "mt-8 justify-center",
        withItems: false,
      })}
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
              className={DS_TYPE.bodyBlock}
              empty={
                cmsMode ? (
                  <p className="section-theme-placeholder m-0 text-sm italic">
                    Optional body…
                  </p>
                ) : null
              }
            />
          </CmsEditable>
        ) : undefined
      }
    />
  );
}
