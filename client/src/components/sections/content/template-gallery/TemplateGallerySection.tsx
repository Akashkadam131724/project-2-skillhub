"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import TemplateGalleryUi from "./TemplateGalleryUi";
import { resolveTemplateGalleryUiItems } from "./lib/map";
import { isTemplateGalleryPlacementShowable } from "./lib/placement";
import type { TemplateGallerySectionProps } from "./lib/types";

export default function TemplateGallerySection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "template_gallery",
  cmsMode,
  onEditField,
  id,
}: TemplateGallerySectionProps) {
  const items = resolveTemplateGalleryUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isTemplateGalleryPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  return (
    <TemplateGalleryUi
      id={id}
      preview
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
      })}
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField, cmsMode })}

    />
  );
}
