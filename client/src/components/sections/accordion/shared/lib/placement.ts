import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { validateSectionItem } from "@/lib/sections/section-items-fields";
import { isFaqItemShowable } from "./items";
import type { FaqSectionProps } from "./types";

export const FAQ_SECTION_KEYS = ["faq", "faq_two_column"] as const;

export type FaqSectionKey = (typeof FAQ_SECTION_KEYS)[number];

export function isFaqSectionKey(key: string): key is FaqSectionKey {
  return FAQ_SECTION_KEYS.includes(
    String(key || "").toLowerCase() as FaqSectionKey
  );
}

export function faqPlacementProbe(props: FaqSectionProps) {
  return sectionProbeFromProps(props.section_key || "faq", props);
}

/** CMS: always show. Public: enabled + ≥1 complete Q+A row. */
export function isFaqPlacementShowable(
  props: FaqSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (!shouldRenderPlacement(faqPlacementProbe(props), false)) return false;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isFaqItemShowable);
}

export function validateFaqItem(
  item: unknown,
  itemsConfig: { fields?: unknown[]; [key: string]: unknown }
) {
  return validateSectionItem(item, itemsConfig);
}
