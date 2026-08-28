import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isVideoBannerItemShowable } from "./map";
import type { VideoBannerSectionProps } from "./types";

export function isVideoBannerPlacementShowable(
  props: VideoBannerSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "video_banner", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isVideoBannerItemShowable);
}
