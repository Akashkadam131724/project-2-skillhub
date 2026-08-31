import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isMasonryQuoteShowable } from "./map";
import type { MasonryQuotesSectionProps } from "./types";

export const isMasonryQuotesPlacementShowable = createPlacementGuard<MasonryQuotesSectionProps>(
  "masonry_quotes",
  isMasonryQuoteShowable
);
