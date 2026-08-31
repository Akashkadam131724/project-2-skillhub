import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isBentoGridCellShowable } from "./map";
import type { BentoGridSectionProps } from "./types";

export const isBentoGridPlacementShowable = createPlacementGuard<BentoGridSectionProps>(
  "bento_grid",
  isBentoGridCellShowable
);
