import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isSuccessStoryShowable } from "./map";
import type { SuccessStoriesSectionProps } from "../../shared/lib/types";

export const isSuccessStoriesPlacementShowable = createPlacementGuard<SuccessStoriesSectionProps>(
  "tabs_success_stories",
  isSuccessStoryShowable
);
