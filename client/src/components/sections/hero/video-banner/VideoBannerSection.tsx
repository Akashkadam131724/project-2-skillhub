"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import VideoBannerUi from "./VideoBannerUi";
import { resolveVideoBannerUiItem } from "./lib/map";
import { isVideoBannerPlacementShowable } from "./lib/placement";
import type { VideoBannerSectionProps } from "./lib/types";

/** CMS-only video_banner adapter → {@link VideoBannerUi}. */
export default function VideoBannerSection({
  items: mappingItems,
  section_key = "video_banner",
  onEditField,
  onFormOpen,
  id,
}: VideoBannerSectionProps) {
  const item = resolveVideoBannerUiItem(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isVideoBannerPlacementShowable(
      { section_key, items: mappingItems },
      true
    )
  ) {
    return null;
  }

  const buttons = Array.isArray(item?.buttons) ? item.buttons : [];
  const mappingList = Array.isArray(mappingItems) ? mappingItems : [];

  return (
    <VideoBannerUi
      id={id}
      item={item}
      mediaSlot={
        item?.videoSrc ? (
          <iframe
            src={item.videoSrc}
            title={item.title || "Video banner"}
            className="block aspect-video w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : item?.fallbackImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.fallbackImageUrl}
            alt={item.title || "Video banner"}
            className="block aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center border border-dashed border-white/25 bg-slate-950 text-sm text-white/50">
            Add a video URL in the banner item.
          </div>
        )
      }
      {...cmsSectionChrome({
        section_key,
        itemCount: mappingList.length,
        onEditField,
        buttons,
        onFormOpen,
        footerClassName: "shrink-0 sm:mt-0",
      })}
    />
  );
}
