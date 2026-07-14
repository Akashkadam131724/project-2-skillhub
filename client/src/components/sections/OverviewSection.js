"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import {
  placementHasMeaningfulContent,
  sectionProbeFromProps,
} from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";
import SectionButtonsFooter from "./SectionButtonsFooter";
import SectionFrame from "./SectionFrame";

/**
 * Overview — `section_img_url` on the left; title / subtitle / body on the right.
 * Buttons + CMS edit sit under the text column (this layout owns placement).
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
      {...frameProps}
    >
      <div
        className={`grid gap-6 sm:gap-8 ${
          showImage
            ? "md:grid-cols-[minmax(16rem,24rem)_minmax(0,1fr)] md:items-start"
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt=""
                className="aspect-[16/9] w-full rounded-lg object-cover sm:aspect-[2/1] md:aspect-[16/9]"
              />
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400 italic sm:aspect-[2/1] md:aspect-[16/9] dark:border-slate-700 dark:text-slate-600">
                Add section image…
              </div>
            )}
          </CmsEditable>
        ) : null}

        <div className="order-2 flex min-w-0 flex-col gap-2 sm:gap-2.5">
          {section_title || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title ? (
                <h2 className="m-0 text-2xl leading-tight font-bold tracking-tight text-ink sm:text-[1.75rem] md:text-3xl dark:text-white">
                  {section_title}
                </h2>
              ) : (
                <h2 className="m-0 text-2xl leading-tight font-bold text-slate-300 italic sm:text-[1.75rem] md:text-3xl dark:text-slate-600">
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
                <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                  {sub_title}
                </p>
              ) : (
                <p className="m-0 text-[15px] leading-relaxed text-slate-300 italic sm:text-base dark:text-slate-600">
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
              className="mt-2 block w-full sm:mt-3"
            >
              <CmsRichText
                html={body}
                className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200"
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
            className="mt-4 sm:mt-5"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
