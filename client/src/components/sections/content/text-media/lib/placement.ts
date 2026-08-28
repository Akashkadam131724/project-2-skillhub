import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isTextMediaItemShowable } from "./map";
import type { TextMediaSectionProps } from "./types";

export function isTextMediaPlacementShowable(
  props: TextMediaSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "text_media", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTextMediaItemShowable);
}
