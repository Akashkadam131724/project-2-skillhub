"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionFrame from "@/components/sections/SectionFrame";
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
  ...frameProps
}: OverviewSectionProps) {
  const body = data?.body || "";
  const imgUrl = mediaUrl(section_img_url);
  const showImage = Boolean(imgUrl) || cmsMode;

  if (!isOverviewPlacementShowable(
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
  )) {
    return null;
  }

  return (
    <SectionFrame
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttonsFooter={false}
      eyebrow="Overview"
      {...frameProps}
    >
      <OverviewUi
        showImage={showImage}
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
                <div className="overflow-hidden rounded-[1.75rem] shadow-[0_36px_80px_-42px_color-mix(in_srgb,var(--ink)_50%,transparent)] ring-1 ring-slate-200/70 dark:ring-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={mediaAlt(section_title, "Overview")}
                    className="aspect-[16/10] max-h-56 w-full object-cover sm:max-h-64 md:max-h-72"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] max-h-56 w-full items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 text-sm text-slate-400 italic sm:max-h-64 md:max-h-72 dark:border-slate-700 dark:text-slate-600">
                  Add section image…
                </div>
              )}
            </CmsEditable>
          ) : undefined
        }
        titleSlot={
          section_title || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title ? (
                <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.12] font-semibold tracking-tight sm:text-4xl">
                  {section_title}
                </h2>
              ) : (
                <h2 className="m-0 text-3xl font-semibold text-slate-300 italic sm:text-4xl dark:text-slate-600">
                  Add title…
                </h2>
              )}
            </CmsEditable>
          ) : undefined
        }
        subtitleSlot={
          sub_title || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="sub_title"
              label="Subtitle"
              onEditField={onEditField}
            >
              {sub_title ? (
                <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                  {sub_title}
                </p>
              ) : (
                <p className="m-0 text-base leading-relaxed text-slate-300 italic dark:text-slate-600">
                  Add subtitle…
                </p>
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
                className="text-[15px] leading-relaxed text-slate-700 sm:text-base dark:text-slate-200"
                empty={
                  cmsMode ? (
                    <p className="m-0 text-[15px] text-slate-300 italic dark:text-slate-600">
                      Add body text…
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
            className="mt-2 sm:mt-3"
          />
        }
      />
    </SectionFrame>
  );
}
