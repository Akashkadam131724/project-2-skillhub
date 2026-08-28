import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { resolvePromoModalConfig } from "./map";
import type { PromoModalSectionProps } from "./types";

export function isPromoModalPlacementShowable(
  props: PromoModalSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  const { body } = resolvePromoModalConfig(props.data);
  if (!isRichTextEmpty(body)) return true;
  const list = sortActiveButtons(
    Array.isArray(props.buttons) && props.buttons.length
      ? props.buttons
      : buttonsFromLegacy(props.button_title, props.target_url)
  );
  return list.length > 0;
}
