import { createContentOrButtonsPlacementGuard } from "@/lib/sections/placement-guard";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { resolvePromoModalConfig } from "./map";
import type { PromoModalSectionProps } from "./types";

const isPromoModalContentOrButtonsShowable =
  createContentOrButtonsPlacementGuard<PromoModalSectionProps>();

export function isPromoModalPlacementShowable(
  props: PromoModalSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  const { body } = resolvePromoModalConfig(props.data);
  if (!isRichTextEmpty(body)) return true;
  return isPromoModalContentOrButtonsShowable(props, false);
}
