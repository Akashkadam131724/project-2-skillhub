"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import {
  placementHasMeaningfulContent,
  sectionProbeFromProps,
} from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";
import SectionButtonsFooter from "./SectionButtonsFooter";
import SectionFrame from "./SectionFrame";

/**
 * Overview — editorial split with image + copy column.
 */
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
}) {
  const body = data?.body || "";
  const imgUrl = mediaUrl(section_img_url);
  const showImage = Boolean(imgUrl) || cmsMode;

  if (
    !cmsMode &&
    !placementHasMeaningfulContent(
      sectionProbeFromProps("overview", {
        section_title,
        sub_title,
        data,
        section_img_url,
        buttons,
        button_title,
        target_url,
      })
    )
  ) {
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
      <div
        className={`grid gap-8 lg:gap-12 ${
          showImage
            ? "lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
            : ""
        }`}
      >
        {showImage ? (
          <CmsEditable
            cmsMode={cmsMode}
            field="section_img_url"
            label="Section image"
            onEditField={onEditField}
            className="order-1 w-full"
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
        ) : null}

        <div className="order-2 flex min-w-0 flex-col gap-4 sm:gap-5">
          {section_title || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title ? (
                <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.12] font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
                  {section_title}
                </h2>
              ) : (
                <h2 className="m-0 text-3xl font-semibold text-slate-300 italic sm:text-4xl dark:text-slate-600">
                  Add title…
                </h2>
              )}
            </CmsEditable>
          ) : null}

          {sub_title || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="sub_title"
              label="Subtitle"
              onEditField={onEditField}
            >
              {sub_title ? (
                <p className="m-0 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {sub_title}
                </p>
              ) : (
                <p className="m-0 text-base leading-relaxed text-slate-300 italic dark:text-slate-600">
                  Add subtitle…
                </p>
              )}
            </CmsEditable>
          ) : null}

          {!isRichTextEmpty(body) || cmsMode ? (
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
          ) : null}

          <SectionButtonsFooter
            buttons={buttons}
            button_title={button_title}
            target_url={target_url}
            cmsMode={cmsMode}
            onEditField={onEditField}
            onFormOpen={onFormOpen}
            className="mt-2 sm:mt-3"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
