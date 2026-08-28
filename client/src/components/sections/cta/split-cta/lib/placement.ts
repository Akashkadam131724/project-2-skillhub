import type { SplitCtaSectionProps } from "./types";

export function isSplitCtaPlacementShowable(
  props: SplitCtaSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  if (String(props.section_img_url || props.data?.image_url || "").trim()) {
    return true;
  }
  if (String(props.button_title || props.target_url || "").trim()) return true;
  const buttons = Array.isArray(props.buttons) ? props.buttons : [];
  return buttons.length > 0;
}
