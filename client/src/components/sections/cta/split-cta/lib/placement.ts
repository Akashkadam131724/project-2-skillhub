import { createSplitCtaPlacementGuard } from "@/lib/sections/placement-guard";
import type { SplitCtaSectionProps } from "./types";

export const isSplitCtaPlacementShowable =
  createSplitCtaPlacementGuard<SplitCtaSectionProps>();
