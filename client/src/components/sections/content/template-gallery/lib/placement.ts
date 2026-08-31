import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTemplateGalleryItemShowable } from "./map";
import type { TemplateGallerySectionProps } from "./types";

export const isTemplateGalleryPlacementShowable = createPlacementGuard<TemplateGallerySectionProps>(
  "template_gallery",
  isTemplateGalleryItemShowable,
  { placementProbe: false }
);
