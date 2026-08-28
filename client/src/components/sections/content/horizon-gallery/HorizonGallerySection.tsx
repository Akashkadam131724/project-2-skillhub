"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
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
      titleSlot={
        section_title || cmsMode ? (
          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title || cmsMode ? (
              <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {section_title || "Gallery"}
              </h2>
            ) : null}
          </CmsEditable>
        ) : undefined
      }
      subtitleSlot={
        sub_title || cmsMode ? (
          <CmsEditable
            cmsMode={cmsMode}
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
          >
            {sub_title || cmsMode ? (
              <p className="mt-3 mb-0 text-base text-white/65">
                {sub_title || "Subtitle"}
              </p>
            ) : null}
          </CmsEditable>
        ) : undefined
      }
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
          className="mb-6 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_p]:text-white/70"
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
