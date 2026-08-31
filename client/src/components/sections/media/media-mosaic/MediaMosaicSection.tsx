"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import MediaMosaicUi from "./MediaMosaicUi";
import { resolveMediaMosaicTileUiItems } from "./lib/map";
import { isMediaMosaicPlacementShowable } from "./lib/placement";
import type { MediaMosaicSectionProps } from "./lib/types";

/** CMS-only media mosaic adapter → {@link MediaMosaicUi}. */
export default function MediaMosaicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "media_mosaic",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MediaMosaicSectionProps) {
  const items = resolveMediaMosaicTileUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isMediaMosaicPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <MediaMosaicUi
      id={id}
      preview
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}

    />
  );
}
