"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import FeatureSpotlightUi from "./FeatureSpotlightUi";
import { resolveFeatureSpotlightUiItems } from "./lib/map";
import { isFeatureSpotlightPlacementShowable } from "./lib/placement";
import type { FeatureSpotlightSectionProps } from "./lib/types";

/**
 * CMS-only feature spotlight adapter → {@link FeatureSpotlightUi}.
 * Public pages use {@link FeatureSpotlightPublicSection}.
 */
export default function FeatureSpotlightSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "feature_spotlight",
  cmsMode,
  onEditField,
  id,
}: FeatureSpotlightSectionProps) {
  if (
    !isFeatureSpotlightPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  const items = resolveFeatureSpotlightUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  return (
    <FeatureSpotlightUi
      id={id}
      preview
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
              {section_title}
            </h2>
          ) : (
            <h2 className="section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl">
              Add title…
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
              {sub_title}
            </p>
          ) : (
            <p className="section-theme-placeholder m-0 text-base leading-relaxed italic">
              Add subtitle…
            </p>
          )}
        </CmsEditable>
      }
      items={items}
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
