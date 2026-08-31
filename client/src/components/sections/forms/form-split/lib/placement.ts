import { createHeaderOrItemsPlacementGuard } from "@/lib/sections/placement-guard";
import { isFormHighlightShowable } from "./map";
import type { FormSplitSectionProps } from "./types";

export const isFormSplitPlacementShowable =
  createHeaderOrItemsPlacementGuard<FormSplitSectionProps>(
    isFormHighlightShowable
  );
