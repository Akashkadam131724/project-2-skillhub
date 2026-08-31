import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isHorizonGalleryPanelShowable } from "./map";
import type { HorizonGallerySectionProps } from "./types";

export const isHorizonGalleryPlacementShowable = createPlacementGuard<HorizonGallerySectionProps>(
  "horizon_gallery",
  isHorizonGalleryPanelShowable,
  { placementProbe: false }
);
