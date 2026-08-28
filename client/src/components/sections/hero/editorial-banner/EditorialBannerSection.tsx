"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import EditorialBannerUi from "./EditorialBannerUi";
import {
  resolveHeroImageUrl,
} from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { EditorialBannerSectionProps } from "./lib/types";

/** CMS-only editorial_banner adapter → {@link EditorialBannerUi}. */
export default function EditorialBannerSection({
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
}: EditorialBannerSectionProps) {
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

  if (!isHeroPlacementShowable("editorial_banner", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);

  return (
    <EditorialBannerUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Editorial banner")}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h1 className="m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              {section_title}
            </h1>
          ) : (
            <h1 className="m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-semibold tracking-tight text-white/40 italic sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              Headline
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
            <p className="mt-5 mb-0 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
              {sub_title}
            </p>
          ) : (
            <p className="mt-5 mb-0 max-w-2xl text-base leading-relaxed text-white/40 italic sm:text-lg lg:text-xl">
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
              className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70"
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
              className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70"
              empty={
                <p className="m-0 text-white/40 italic">Add body copy…</p>
              }
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
          className="mt-8"
        />
      }
    />
  );
}
