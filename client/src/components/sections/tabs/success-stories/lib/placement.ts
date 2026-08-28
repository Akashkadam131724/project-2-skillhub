import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isSuccessStoryShowable } from "./map";
import type { SuccessStoriesSectionProps } from "../../shared/lib/types";

export function isSuccessStoriesPlacementShowable(
  props: SuccessStoriesSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(
        props.section_key || "tabs_success_stories",
        props
      ),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isSuccessStoryShowable);
}
