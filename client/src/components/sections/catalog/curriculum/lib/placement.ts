import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isCurriculumItemShowable } from "./map";
import type { CurriculumSectionProps } from "./types";

export const isCurriculumPlacementShowable = createPlacementGuard<CurriculumSectionProps>(
  "curriculum",
  isCurriculumItemShowable
);
