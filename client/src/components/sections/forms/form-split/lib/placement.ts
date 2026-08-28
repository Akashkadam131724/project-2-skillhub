import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { isFormHighlightShowable } from "./map";
import type { FormSplitSectionProps } from "./types";

export function isFormSplitPlacementShowable(
  props: FormSplitSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  if (!isRichTextEmpty(props.data?.body)) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isFormHighlightShowable);
}
