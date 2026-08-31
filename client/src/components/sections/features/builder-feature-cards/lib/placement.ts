import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isBuilderFeatureCardShowable } from "./map";
import type { BuilderFeatureCardsSectionProps } from "./types";

export const isBuilderFeatureCardsPlacementShowable = createPlacementGuard<BuilderFeatureCardsSectionProps>(
  "builder_feature_cards",
  isBuilderFeatureCardShowable
);
