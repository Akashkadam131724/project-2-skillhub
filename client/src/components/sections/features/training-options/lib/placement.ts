import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTrainingOptionShowable } from "./map";
import type { TrainingOptionsSectionProps } from "./types";

export const isTrainingOptionsPlacementShowable = createPlacementGuard<TrainingOptionsSectionProps>(
  "training_options",
  isTrainingOptionShowable
);
