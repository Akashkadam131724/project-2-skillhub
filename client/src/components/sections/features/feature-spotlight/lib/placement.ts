import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isFeatureSpotlightItemShowable } from "./map";
import type { FeatureSpotlightSectionProps } from "./types";

export const isFeatureSpotlightPlacementShowable = createPlacementGuard<FeatureSpotlightSectionProps>(
  "feature_spotlight",
  isFeatureSpotlightItemShowable,
  { placementProbe: false }
);
