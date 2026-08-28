import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import type { NewsletterBandSectionProps } from "./types";

export function isNewsletterBandPlacementShowable(
  props: NewsletterBandSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  const list = sortActiveButtons(
    Array.isArray(props.buttons) && props.buttons.length
      ? props.buttons
      : buttonsFromLegacy(props.button_title, props.target_url)
  );
  return list.length > 0;
}
