import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { isContactChannelShowable } from "./map";
import type { ContactUsSectionProps } from "./types";

export function isContactUsPlacementShowable(
  props: ContactUsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (String(props.section_title || "").trim()) return true;
  if (String(props.sub_title || "").trim()) return true;
  if (!isRichTextEmpty(props.data?.body)) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isContactChannelShowable);
}
