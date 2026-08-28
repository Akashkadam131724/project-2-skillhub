"use client";

import InPageNavUi from "./InPageNavUi";
import { buildInPageNavItems } from "./lib/map";
import { isInPageNavPlacementShowable } from "./lib/placement";
import type { InPageNavSectionProps } from "./lib/types";

/**
 * Public in-page nav — links from sections below this placement.
 * Do not wrap the sticky nav in a short parent (sticky is block-height limited).
 */
export default function InPageNavPublicSection({
  navSections = [],
  id,
}: InPageNavSectionProps) {
  if (
    !isInPageNavPlacementShowable({ navSections }, false)
  ) {
    return null;
  }

  const items = buildInPageNavItems(navSections);

  return <InPageNavUi id={id} items={items} />;
}
