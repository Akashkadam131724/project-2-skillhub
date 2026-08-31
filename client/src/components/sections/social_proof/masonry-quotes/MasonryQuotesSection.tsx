"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import MasonryQuotesUi from "./MasonryQuotesUi";
import { resolveMasonryQuoteUiItems } from "./lib/map";
import { isMasonryQuotesPlacementShowable } from "./lib/placement";
import type { MasonryQuotesSectionProps } from "./lib/types";

/** CMS-only masonry quotes adapter → {@link MasonryQuotesUi}. */
export default function MasonryQuotesSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "masonry_quotes",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MasonryQuotesSectionProps) {
  const items = resolveMasonryQuoteUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isMasonryQuotesPlacementShowable(
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
    <MasonryQuotesUi
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
