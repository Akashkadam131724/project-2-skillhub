import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isWebsiteBuildStepShowable } from "./map";
import type { WebsiteBuildStepsSectionProps } from "./types";

export const isWebsiteBuildStepsPlacementShowable = createPlacementGuard<WebsiteBuildStepsSectionProps>(
  "website_build_steps",
  isWebsiteBuildStepShowable,
  { placementProbe: false }
);
