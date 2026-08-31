import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTimelineStepShowable } from "./map";
import type { TimelineVerticalSectionProps } from "./types";

export const isTimelineVerticalPlacementShowable = createPlacementGuard<TimelineVerticalSectionProps>(
  "timeline_vertical",
  isTimelineStepShowable
);
