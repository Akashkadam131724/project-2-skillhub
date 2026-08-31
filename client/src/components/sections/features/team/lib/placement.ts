import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTeamItemShowable } from "./map";
import type { TeamSectionProps } from "./types";

export const isTeamPlacementShowable = createPlacementGuard<TeamSectionProps>(
  "team",
  isTeamItemShowable,
  { placementProbe: false }
);
