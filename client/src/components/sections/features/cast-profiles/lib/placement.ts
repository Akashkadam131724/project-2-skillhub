import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isCastProfileShowable } from "./map";
import type { CastProfilesSectionProps } from "./types";

export const isCastProfilesPlacementShowable = createPlacementGuard<CastProfilesSectionProps>(
  "cast_profiles",
  isCastProfileShowable
);
