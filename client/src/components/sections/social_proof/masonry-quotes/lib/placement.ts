import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isMasonryQuoteShowable } from "./map";
import type { MasonryQuotesSectionProps } from "./types";

export function isMasonryQuotesPlacementShowable(
  props: MasonryQuotesSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "masonry_quotes", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isMasonryQuoteShowable);
}
