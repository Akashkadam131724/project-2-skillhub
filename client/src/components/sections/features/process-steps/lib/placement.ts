import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isProcessStepShowable } from "./map";
import type { ProcessStepsSectionProps } from "./types";

export const isProcessStepsPlacementShowable = createPlacementGuard<ProcessStepsSectionProps>(
  "process_steps",
  isProcessStepShowable
);
