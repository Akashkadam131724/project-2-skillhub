import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isStatShowable } from "./map";
import type { StatsSectionProps } from "./types";

export const isStatsPlacementShowable = createPlacementGuard<StatsSectionProps>(
  "stats",
  isStatShowable
);
