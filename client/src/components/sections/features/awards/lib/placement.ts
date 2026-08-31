import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isAwardShowable } from "./map";
import type { AwardsSectionProps } from "./types";

export const isAwardsPlacementShowable = createPlacementGuard<AwardsSectionProps>(
  "awards",
  isAwardShowable
);
