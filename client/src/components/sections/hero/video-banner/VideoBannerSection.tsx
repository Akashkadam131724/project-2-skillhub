"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
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
  const hasCopy = Boolean(item?.title || item?.subtitle || buttons.length);

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
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={item ? 1 : 0}
          className="mt-4 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_p]:text-white/60"
        />
      }
      footer={
        hasCopy || buttons.length ? (
          <SectionButtonsFooter
            buttons={buttons}
            cmsMode
            editField="items"
            onEditField={(field) =>
              onEditField?.(field, { expandItemButtons: true })
            }
            onFormOpen={onFormOpen}
            inverted
            className="shrink-0 sm:mt-0"
            buttonsClassName="flex flex-wrap items-center justify-start gap-3 sm:justify-end"
          />
        ) : null
      }
    />
  );
}
