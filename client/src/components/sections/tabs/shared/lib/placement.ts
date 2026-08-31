import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isNestedTabShowable } from "./map";
import type { TabsSectionProps } from "./types";

export const isNestedTabsPlacementShowable = createPlacementGuard<TabsSectionProps>(
  "feature_tabs",
  isNestedTabShowable
);
