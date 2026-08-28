import { isTeamItemShowable } from "./map";
import type { TeamSectionProps } from "./types";

export function isTeamPlacementShowable(
  props: TeamSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTeamItemShowable);
}
