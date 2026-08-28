"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaUrl } from "@/lib/api/cms-api";
import SplitCtaUi from "./SplitCtaUi";
import {
  normalizeSplitCtaImageSide,
  resolveSplitCtaBandStyle,
} from "./lib/band";
import { isSplitCtaPlacementShowable } from "./lib/placement";
import type { SplitCtaSectionProps } from "./lib/types";

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
  id,
}: SplitCtaSectionProps) {
  const imageUrl = mediaUrl(section_img_url || data?.image_url);
  const imageSide = normalizeSplitCtaImageSide(data);
  const bandStyle = resolveSplitCtaBandStyle(section_bg_color, data?.bg_color);

  if (
    !isSplitCtaPlacementShowable(
      {
        section_title,
        sub_title,
        section_img_url,
        data,
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
    <SplitCtaUi
      id={id}
      preview
      imageUrl={imageUrl}
      imageSide={imageSide}
      bandStyle={bandStyle}
      useThemeBand={!bandStyle}
      titleSlot={
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
      }
      subtitleSlot={
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
      }
      footer={
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
      }
      imageSideControl={
        cmsMode ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-white/15 py-2">
            <span className="text-[11px] font-semibold tracking-wide text-white/70 uppercase">
              Image
            </span>
            {(["left", "right"] as const).map((side) => (
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
        ) : undefined
      }
    />
  );
}
