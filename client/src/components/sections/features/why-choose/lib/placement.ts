import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isWhyChooseShowable } from "./map";
import type { WhyChooseSectionProps } from "./types";

export const isWhyChoosePlacementShowable = createPlacementGuard<WhyChooseSectionProps>(
  "why_choose",
  isWhyChooseShowable
);
