import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isMediaMosaicTileShowable } from "./map";
import type { MediaMosaicSectionProps } from "./types";

export const isMediaMosaicPlacementShowable = createPlacementGuard<MediaMosaicSectionProps>(
  "media_mosaic",
  isMediaMosaicTileShowable
);
