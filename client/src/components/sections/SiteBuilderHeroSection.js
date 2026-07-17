"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Editorial website-builder hero inspired by Squarespace's bold homepage:
 * huge type, black/white contrast, and layered site previews.
 */
export default function SiteBuilderHeroSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const heroImage = mediaUrl(section_img_url || data?.image_url);
  const badge = data?.label || data?.eyebrow || "";
  const body = data?.body || "";

  if (
    !cmsMode &&
    !section_title &&
    !sub_title &&
    isRichTextEmpty(body) &&
    !heroImage
  ) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#0b0b0a] text-white">
      <div className="absolute inset-x-0 top-0 z-[1] border-b border-white/10 bg-[#0b0b0a]/85 backdrop-blur">
        <SectionWrapper className="flex h-14 items-center justify-between text-xs font-semibold tracking-[0.18em] uppercase">
          <span>{badge || "Build Studio"}</span>
          <span className="hidden text-white/55 sm:inline">Websites · Stores · Domains</span>
        </SectionWrapper>
      </div>

      <SectionWrapper className="grid min-h-[92vh] items-end gap-10 pt-28 pb-8 lg:grid-cols-12 lg:pt-32 lg:pb-12">
        <div className="relative z-[2] lg:col-span-7">
          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title || cmsMode ? (
              <h1 className="m-0 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8.8rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-white">
                {section_title || "A website makes it real"}
              </h1>
            ) : null}
          </CmsEditable>

          <CmsEditable
            cmsMode={cmsMode}
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
          >
            {sub_title || cmsMode ? (
              <p className="mt-7 mb-0 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl">
                {sub_title || "Launch a site that looks designed from day one."}
              </p>
            ) : null}
          </CmsEditable>

          {!isRichTextEmpty(body) || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="body"
              label="Body"
              onEditField={onEditField}
            >
              <CmsRichText
                html={body}
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/55"
                empty={
                  cmsMode ? (
                    <p className="m-0 text-white/35 italic">Add supporting copy...</p>
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
            inverted
            className="mt-9"
          />
        </div>

        <div className="relative min-h-[24rem] lg:col-span-5 lg:min-h-[34rem]">
          <div className="absolute -right-10 bottom-0 w-[80%] rotate-3 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white shadow-2xl">
            <div className="aspect-[3/4] bg-slate-200">
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImage} alt={mediaAlt(section_title, "Site preview")} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(145deg,#f4efe8,#b5c7bc)]" />
              )}
            </div>
          </div>
          <div className="absolute bottom-14 left-0 w-[72%] -rotate-2 overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#f5f0e8] p-4 shadow-2xl">
            <div className="grid gap-3">
              <div className="h-24 rounded-xl bg-[#1f1f1b]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-28 rounded-xl bg-[#d8cbbb]" />
                <div className="h-28 rounded-xl bg-[#a7b5a7]" />
              </div>
              <div className="h-3 w-2/3 rounded-full bg-[#1f1f1b]/30" />
            </div>
          </div>
          <div className="absolute right-10 top-10 hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur sm:block">
            No code needed
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
