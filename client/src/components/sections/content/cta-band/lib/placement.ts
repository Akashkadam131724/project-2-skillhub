import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { CtaBandSectionProps } from "./types";

export function isCtaBandPlacementShowable(
  props: CtaBandSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  return !isRichTextEmpty(props.data?.body);
}
