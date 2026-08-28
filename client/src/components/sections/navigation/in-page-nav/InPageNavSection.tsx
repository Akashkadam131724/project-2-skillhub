"use client";

import InPageNavCmsPreview from "./InPageNavCmsPreview";
import InPageNavUi from "./InPageNavUi";
import { buildInPageNavItems } from "./lib/map";
import { isInPageNavPlacementShowable } from "./lib/placement";
import type { InPageNavSectionProps } from "./lib/types";

/** CMS-only in-page nav adapter. */
export default function InPageNavSection({
  navSections = [],
  section_key = "in_page_nav",
  id,
}: InPageNavSectionProps) {
  if (
    !isInPageNavPlacementShowable({ navSections, section_key }, true)
  ) {
    return null;
  }

  const items = buildInPageNavItems(navSections);

  return (
    <>
      <InPageNavCmsPreview sectionKey={section_key} />
      <InPageNavUi id={id} items={items} preview />
    </>
  );
}
