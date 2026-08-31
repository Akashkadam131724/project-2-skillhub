"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { mediaUrl } from "@/lib/api/cms-api";
import { sectionClassNames } from "@/lib/layout/section-layout-system";
import SplitCtaUi from "./SplitCtaUi";
import {
  SPLIT_CTA_SUBTITLE_CLASS,
  SPLIT_CTA_TITLE_CLASS,
} from "./lib/band";
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
      {...(cmsMode
        ? cmsSectionHeaderSlots({
            section_title,
            sub_title,
            onEditField,
            inverted: true,
            cmsMode,
            titleClassName: SPLIT_CTA_TITLE_CLASS,
            subtitleClassName: SPLIT_CTA_SUBTITLE_CLASS,
            titlePlaceholderClassName: sectionClassNames(
              SPLIT_CTA_TITLE_CLASS,
              "text-white/40 italic"
            ),
            subtitlePlaceholderClassName: sectionClassNames(
              SPLIT_CTA_SUBTITLE_CLASS,
              "text-white/40 italic"
            ),
          })
        : {
            title: section_title || undefined,
            subtitle: sub_title || undefined,
          })}
      {...cmsSectionChrome({
        section_key: "split_cta",
        itemCount: 0,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        inverted: true,
        footerClassName: "mt-0",
        buttonsClassName:
          "flex flex-wrap items-center gap-3 [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-2.5",
        withItems: false,
      })}
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
