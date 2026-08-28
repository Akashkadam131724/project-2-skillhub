"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import OrbitHeroUi from "./OrbitHeroUi";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { OrbitHeroSectionProps } from "./lib/types";

/** CMS-only orbit_hero adapter → {@link OrbitHeroUi}. */
export default function OrbitHeroSection({
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
}: OrbitHeroSectionProps) {
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

  if (!isHeroPlacementShowable("orbit_hero", props, true)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const badge = data?.label || data?.eyebrow || "";

  return (
    <OrbitHeroUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Product preview")}
      badge={badge || undefined}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
          className="justify-center"
        >
          {section_title ? (
            <h1 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight">
              {section_title}
            </h1>
          ) : (
            <h1 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight italic opacity-40">
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
          className="justify-center"
        >
          {sub_title ? (
            <p className="section-theme-muted mt-5 mb-0 max-w-2xl text-base leading-relaxed sm:text-lg">
              {sub_title}
            </p>
          ) : (
            <p className="section-theme-muted mt-5 mb-0 max-w-2xl text-base leading-relaxed italic opacity-40 sm:text-lg">
              Supporting line
            </p>
          )}
        </CmsEditable>
      }
      bodySlot={
        !isRichTextEmpty(body) ? (
          <CmsRichText
            html={body}
            className="section-theme-muted mt-4 max-w-xl text-sm"
          />
        ) : undefined
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="mt-8 flex flex-col items-center"
          buttonsClassName="flex flex-wrap items-center justify-center gap-3"
        />
      }
    />
  );
}
