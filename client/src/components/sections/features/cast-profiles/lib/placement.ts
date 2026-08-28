import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isCastProfileShowable } from "./map";
import type { CastProfilesSectionProps } from "./types";

export function isCastProfilesPlacementShowable(
  props: CastProfilesSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "cast_profiles", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isCastProfileShowable);
}
