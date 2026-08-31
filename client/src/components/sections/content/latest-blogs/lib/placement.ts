import { createAlwaysShowPlacementGuard } from "@/lib/sections/placement-guard";
import type { LatestBlogsSectionProps } from "./types";

/** Public pages always attempt fetch; empty state handled client-side. */
export const isLatestBlogsPlacementShowable =
  createAlwaysShowPlacementGuard<LatestBlogsSectionProps>();
