import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isComparisonItemShowable } from "./map";
import type { ComparisonTableSectionProps } from "./types";

export const isComparisonPlacementShowable = createPlacementGuard<ComparisonTableSectionProps>(
  "comparison_table",
  isComparisonItemShowable
);
