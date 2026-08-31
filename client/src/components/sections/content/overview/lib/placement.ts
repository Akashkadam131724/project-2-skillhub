import { createProbePlacementGuard } from "@/lib/sections/placement-guard";
import type { OverviewSectionProps } from "./types";

export const isOverviewPlacementShowable =
  createProbePlacementGuard<OverviewSectionProps>("overview");
