import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isMediaMosaicTileShowable } from "./map";
import type { MediaMosaicSectionProps } from "./types";

export function isMediaMosaicPlacementShowable(
  props: MediaMosaicSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "media_mosaic", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  if (items.some(isMediaMosaicTileShowable)) return true;
  const list = sortActiveButtons(
    Array.isArray(props.buttons) && props.buttons.length
      ? props.buttons
      : buttonsFromLegacy(props.button_title, props.target_url)
  );
  return list.length > 0;
}
