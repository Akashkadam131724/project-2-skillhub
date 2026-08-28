import type { LatestBlogsSectionProps } from "./types";

/** Public pages always attempt fetch; empty state handled client-side. */
export function isLatestBlogsPlacementShowable(
  _props: LatestBlogsSectionProps,
  cmsMode = false
): boolean {
  return cmsMode || true;
}
