import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTrustBadgeShowable } from "./map";
import type { TrustBadgesSectionProps } from "./types";

export const isTrustBadgesPlacementShowable = createPlacementGuard<TrustBadgesSectionProps>(
  "trust_badges",
  isTrustBadgeShowable
);
