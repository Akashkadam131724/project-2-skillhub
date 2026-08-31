import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isMetricRailItemShowable } from "./map";
import type { MetricRailSectionProps } from "./types";

export const isMetricRailPlacementShowable = createPlacementGuard<MetricRailSectionProps>(
  "metric_rail",
  isMetricRailItemShowable
);
