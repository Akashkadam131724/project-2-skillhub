import { isTemplateGalleryItemShowable } from "./map";
import type { TemplateGallerySectionProps } from "./types";

export function isTemplateGalleryPlacementShowable(
  props: TemplateGallerySectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTemplateGalleryItemShowable);
}
