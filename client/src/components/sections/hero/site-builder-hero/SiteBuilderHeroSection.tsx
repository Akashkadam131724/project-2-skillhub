"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import SiteBuilderHeroUi from "./SiteBuilderHeroUi";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { SiteBuilderHeroSectionProps } from "./lib/types";

/** CMS-only site_builder_hero adapter → {@link SiteBuilderHeroUi}. */
export default function SiteBuilderHeroSection({
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
}: SiteBuilderHeroSectionProps) {
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

  if (!isHeroPlacementShowable("site_builder_hero", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const badge = data?.label || data?.eyebrow || "";

  return (
    <SiteBuilderHeroUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Site preview")}
      badge={badge || undefined}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h1 className="m-0 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8.8rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-white">
              {section_title}
            </h1>
          ) : (
            <h1 className="m-0 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8.8rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-white/40 italic">
              A website makes it real
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
            <p className="mt-7 mb-0 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl">
              {sub_title}
            </p>
          ) : (
            <p className="mt-7 mb-0 max-w-xl text-lg leading-relaxed text-white/40 italic sm:text-xl">
              Launch a site that looks designed from day one.
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
              className="mt-4 max-w-lg text-sm leading-relaxed text-white/55"
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
              className="mt-4 max-w-lg text-sm leading-relaxed text-white/55"
              empty={
                <p className="m-0 text-white/35 italic">
                  Add supporting copy...
                </p>
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
          inverted
          className="mt-9"
        />
      }
    />
  );
}
