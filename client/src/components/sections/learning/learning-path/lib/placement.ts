import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isLearningPathStepShowable } from "./map";
import type { LearningPathSectionProps } from "./types";

export const isLearningPathPlacementShowable = createPlacementGuard<LearningPathSectionProps>(
  "learning_path",
  isLearningPathStepShowable
);
