"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import HorizonGalleryUi from "./HorizonGalleryUi";
import { resolveHorizonGalleryPanelUiItems } from "./lib/map";
import { isHorizonGalleryPlacementShowable } from "./lib/placement";
import type { HorizonGallerySectionProps } from "./lib/types";

export default function HorizonGallerySection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "horizon_gallery",
  cmsMode,
  onEditField,
  id,
}: HorizonGallerySectionProps) {
  const items = resolveHorizonGalleryPanelUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isHorizonGalleryPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  return (
    <HorizonGalleryUi
      id={id}
      preview
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
      })}
      {...cmsSectionHeaderSlots({
        section_title: section_title || (cmsMode ? "Gallery" : undefined),
        sub_title: sub_title || (cmsMode ? "Subtitle" : undefined),
        onEditField,
        cmsMode,
        inverted: true,
      })}

    />
  );
}
