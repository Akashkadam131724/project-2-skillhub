"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import { mediaUrl } from "@/lib/api/cms-api";
import SplitNarrativeUi from "./SplitNarrativeUi";
import { resolveSplitNarrativeChapterUiItems } from "./lib/map";
import { isSplitNarrativePlacementShowable } from "./lib/placement";
import type { SplitNarrativeSectionProps } from "./lib/types";

export default function SplitNarrativeSection({
  section_title,
  sub_title,
  section_img_url,
  items: mappingItems,
  section_key = "split_narrative",
  cmsMode,
  onEditField,
  id,
}: SplitNarrativeSectionProps) {
  const items = resolveSplitNarrativeChapterUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const coverImageUrl = mediaUrl(section_img_url);

  if (
    !isSplitNarrativePlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  return (
    <SplitNarrativeUi
      id={id}
      preview
      coverImageUrl={coverImageUrl}
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
              <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                {section_title || "Story"}
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
              <p className="section-theme-muted mt-3 mb-0 text-base">
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
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
