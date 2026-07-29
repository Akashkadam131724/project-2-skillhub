"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "../SectionWrapper";
import { mediaUrl } from "@/lib/cms-api";
import { bannerBgStyle } from "@/lib/banner-bg";

/** Theme band — ink → brand (inherits page / site theme CSS vars). */
const THEME_BAND_CLASS =
  "bg-[linear-gradient(to_right,var(--ink),var(--brand))] text-white";

function resolveCustomBandStyle(section_bg_color, legacy_bg_color) {
  const raw = String(section_bg_color || legacy_bg_color || "").trim();
  if (!raw) return null;
  return bannerBgStyle(raw);
}

function normalizeImageSide(data) {
  const raw = String(data?.image_side || "right").toLowerCase();
  return raw === "left" ? "left" : "right";
}

/**
 * Full-bleed gradient CTA — copy column + bottom-aligned hero image.
 * Default background uses site/page theme (--ink → --brand). Optional
 * section_bg_color overrides for one-off bands.
 */
export default function SplitCtaSection({
  section_title,
  sub_title,
  section_img_url,
  section_bg_color,
  data,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const img = mediaUrl(section_img_url || data?.image_url);
  const imageSide = normalizeImageSide(data);
  const customBandStyle = resolveCustomBandStyle(
    section_bg_color,
    data?.bg_color
  );

  const copyCol = (
    <div className="flex w-full flex-[2] items-center py-10 md:py-14 lg:py-[60px]">
      <div className="w-full min-w-0">
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title || cmsMode ? (
            <h2 className="m-0 mb-3 max-w-xl text-[22px] leading-[30px] font-semibold text-white md:mb-3 md:text-xl md:leading-[26px] lg:mb-[18px] lg:text-[26px] lg:leading-9 xl:text-[32px] xl:leading-[42px]">
              {section_title || (
                <span className="text-white/40 italic">Add title…</span>
              )}
            </h2>
          ) : null}
        </CmsEditable>
        <CmsEditable
          cmsMode={cmsMode}
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title || cmsMode ? (
            <p className="m-0 mb-6 max-w-xl text-base leading-6 font-normal text-white/90 md:mb-[26px] md:text-sm md:leading-[18px] lg:mb-[34px] lg:text-sm lg:leading-[22px] xl:text-base xl:leading-6">
              {sub_title || (
                <span className="text-white/40 italic">Add subtitle…</span>
              )}
            </p>
          ) : null}
        </CmsEditable>
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted
          className="mt-0"
          buttonsClassName="flex flex-wrap items-center gap-3 [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2.5"
        />
      </div>
    </div>
  );

  const imageCol = (
    <div className="relative hidden h-[260px] w-full flex-1 md:block">
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt=""
          className="absolute inset-0 size-full object-contain object-bottom"
        />
      ) : cmsMode ? (
        <p className="absolute inset-0 flex items-end justify-center pb-4 text-sm text-white/40 italic">
          Add section image (section_img_url)…
        </p>
      ) : null}
    </div>
  );

  return (
    <section
      className={`relative w-full overflow-hidden py-0 ${
        customBandStyle ? "" : THEME_BAND_CLASS
      }`}
      style={customBandStyle || undefined}
    >
      <SectionWrapper>
        {cmsMode ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-white/15 py-2">
            <span className="text-[11px] font-semibold tracking-wide text-white/70 uppercase">
              Image
            </span>
            {(["left", "right"]).map((side) => (
              <button
                key={side}
                type="button"
                onClick={() =>
                  onEditField?.("cta_image_side", { preset: side })
                }
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  imageSide === side
                    ? "bg-white text-ink"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        ) : null}
        <div
          className={`flex items-end gap-0 md:gap-[90px] lg:gap-[120px] xl:gap-[180px] ${
            imageSide === "left" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {copyCol}
          {imageCol}
        </div>
      </SectionWrapper>
    </section>
  );
}
