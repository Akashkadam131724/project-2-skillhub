import { isDomainChipShowable } from "./map";
import type { DomainSearchBandSectionProps } from "./types";

export function isDomainSearchBandPlacementShowable(
  props: DomainSearchBandSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isDomainChipShowable);
}
