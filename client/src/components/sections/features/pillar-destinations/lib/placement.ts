import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isPillarDestinationsItemShowable } from "./map";
import type { PillarDestinationsSectionProps } from "./types";

export const isPillarDestinationsPlacementShowable = createPlacementGuard<PillarDestinationsSectionProps>(
  "pillar_destinations",
  isPillarDestinationsItemShowable,
  { placementProbe: false }
);
