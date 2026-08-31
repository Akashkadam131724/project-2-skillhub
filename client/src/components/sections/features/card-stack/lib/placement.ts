import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isCardStackItemShowable } from "./map";
import type { CardStackSectionProps } from "./types";

export const isCardStackPlacementShowable = createPlacementGuard<CardStackSectionProps>(
  "card_stack",
  isCardStackItemShowable
);
