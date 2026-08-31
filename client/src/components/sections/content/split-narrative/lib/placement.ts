import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isSplitNarrativeChapterShowable } from "./map";
import type { SplitNarrativeSectionProps } from "./types";

export const isSplitNarrativePlacementShowable = createPlacementGuard<SplitNarrativeSectionProps>(
  "split_narrative",
  isSplitNarrativeChapterShowable,
  { placementProbe: false }
);
