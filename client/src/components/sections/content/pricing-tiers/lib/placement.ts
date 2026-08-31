import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isPricingTierShowable } from "./map";
import type { PricingTiersSectionProps } from "./types";

export const isPricingTiersPlacementShowable = createPlacementGuard<PricingTiersSectionProps>(
  "pricing_tiers",
  isPricingTierShowable
);
