"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import {
  DS_RADIUS,
  DS_TYPE,
  sectionClassNames,
} from "@/lib/sections/section-design-system";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import OverviewUi from "./OverviewUi";
import { isOverviewPlacementShowable } from "./lib/placement";
import type { OverviewSectionProps } from "./lib/types";

export default function OverviewSection({
  section_title,
  sub_title,
  data,
  cmsMode,
  onEditField,
  section_img_url,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: OverviewSectionProps) {
  const body = data?.body || "";
  const imgUrl = mediaUrl(section_img_url);
  const showImage = Boolean(imgUrl) || cmsMode;

  if (
    !isOverviewPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        section_img_url,
        buttons,
        button_title,
        target_url,
      },
      cmsMode
    )
  ) {
    return null;
  }

  return (
    <OverviewUi
      id={id}
      showImage={showImage}
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        cmsMode,
      })}
      {...cmsSectionChrome({
        section_key: "overview",
        itemCount: 0,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        footerClassName: "mt-2 sm:mt-3",
        withItems: false,
      })}
      imageSlot={
        showImage ? (
          <CmsEditable
            cmsMode={cmsMode}
            field="section_img_url"
            label="Section image"
            onEditField={onEditField}
            className="block w-full"
          >
            {imgUrl ? (
              <div
                className={sectionClassNames(
                  DS_RADIUS.media,
                  "overflow-hidden shadow-[0_36px_80px_-42px_color-mix(in_srgb,var(--ink)_50%,transparent)] ring-1 ring-slate-200/70 dark:ring-slate-800"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={mediaAlt(section_title, "Overview")}
                  className="aspect-[16/10] max-h-56 w-full object-cover sm:max-h-64 md:max-h-72"
                />
              </div>
            ) : (
              <div
                className={sectionClassNames(
                  DS_RADIUS.media,
                  "flex aspect-[16/10] max-h-56 w-full items-center justify-center border border-dashed border-slate-300 text-sm text-slate-400 italic sm:max-h-64 md:max-h-72 dark:border-slate-700 dark:text-slate-600"
                )}
              >
                Add section image…
              </div>
            )}
          </CmsEditable>
        ) : undefined
      }
      bodySlot={
        !isRichTextEmpty(body) || cmsMode ? (
          <CmsEditable
            cmsMode={cmsMode}
            field="body"
            label="Body"
            onEditField={onEditField}
            className="block w-full"
          >
            <CmsRichText
              html={body}
              className={DS_TYPE.bodyBlock}
              empty={
                cmsMode ? (
                  <p className={sectionClassNames(DS_TYPE.placeholderSubtitle)}>
                    Add body text…
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
