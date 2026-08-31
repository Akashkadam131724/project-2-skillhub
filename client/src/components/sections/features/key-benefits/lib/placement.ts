import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isKeyBenefitShowable } from "./map";
import type { KeyBenefitsSectionProps } from "./types";

export const isKeyBenefitsPlacementShowable = createPlacementGuard<KeyBenefitsSectionProps>(
  "key_benefits",
  isKeyBenefitShowable
);
