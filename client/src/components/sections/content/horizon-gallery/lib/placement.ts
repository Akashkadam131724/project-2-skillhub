import { isHorizonGalleryPanelShowable } from "./map";
import type { HorizonGallerySectionProps } from "./types";

export function isHorizonGalleryPlacementShowable(
  props: HorizonGallerySectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isHorizonGalleryPanelShowable);
}
