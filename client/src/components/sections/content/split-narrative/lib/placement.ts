import { isSplitNarrativeChapterShowable } from "./map";
import type { SplitNarrativeSectionProps } from "./types";

export function isSplitNarrativePlacementShowable(
  props: SplitNarrativeSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isSplitNarrativeChapterShowable);
}
