"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import StatementBandUi from "./StatementBandUi";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { StatementBandSectionProps } from "./lib/types";

/** CMS-only statement_band adapter → {@link StatementBandUi}. */
export default function StatementBandSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
  id,
}: StatementBandSectionProps) {
  const body = data?.body || "";
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("statement_band", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const eyebrow = data?.eyebrow || data?.label || "";

  return (
    <StatementBandUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Statement background")}
      eyebrow={eyebrow || undefined}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-tight text-white">
              {section_title}
            </h1>
          ) : (
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-tight text-white/40 italic">
              Statement
            </h1>
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
            <p className="mt-8 mb-0 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              {sub_title}
            </p>
          ) : (
            <p className="mt-8 mb-0 max-w-2xl text-lg leading-relaxed text-white/40 italic sm:text-xl">
              Supporting line
            </p>
          )}
        </CmsEditable>
      }
      bodySlot={
        !isRichTextEmpty(body) ? (
          <CmsEditable
            cmsMode
            field="body"
            label="Body"
            onEditField={onEditField}
          >
            <CmsRichText
              html={body}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60"
            />
          </CmsEditable>
        ) : (
          <CmsEditable
            cmsMode
            field="body"
            label="Body"
            onEditField={onEditField}
          >
            <CmsRichText
              html=""
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60"
              empty={<p className="m-0 text-white/35 italic">Add body…</p>}
            />
          </CmsEditable>
        )
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted
          className="mt-10"
        />
      }
    />
  );
}
