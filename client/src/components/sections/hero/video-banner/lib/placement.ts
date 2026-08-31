import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isVideoBannerItemShowable } from "./map";
import type { VideoBannerSectionProps } from "./types";

export const isVideoBannerPlacementShowable = createPlacementGuard<VideoBannerSectionProps>(
  "video_banner",
  isVideoBannerItemShowable
);
