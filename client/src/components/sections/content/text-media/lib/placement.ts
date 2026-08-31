import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTextMediaItemShowable } from "./map";
import type { TextMediaSectionProps } from "./types";

export const isTextMediaPlacementShowable = createPlacementGuard<TextMediaSectionProps>(
  "text_media",
  isTextMediaItemShowable
);
