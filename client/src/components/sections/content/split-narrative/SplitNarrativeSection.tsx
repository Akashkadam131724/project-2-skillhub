"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
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
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
      })}
      {...cmsSectionHeaderSlots({
        section_title: section_title || (cmsMode ? "Story" : undefined),
        sub_title: sub_title || (cmsMode ? "Subtitle" : undefined),
        onEditField,
        cmsMode,
      })}

    />
  );
}
