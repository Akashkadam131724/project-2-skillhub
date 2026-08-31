import { createPlacementGuard } from "@/lib/sections/placement-guard";
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

const isFaqItemsShowable = createPlacementGuard<FaqSectionProps>(
  "faq",
  isFaqItemShowable,
  { placementProbe: false }
);

/** CMS: always show. Public: enabled + ≥1 complete Q+A row. */
export function isFaqPlacementShowable(
  props: FaqSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (!shouldRenderPlacement(faqPlacementProbe(props), false)) return false;
  return isFaqItemsShowable(props, false);
}

export function validateFaqItem(
  item: unknown,
  itemsConfig: { fields?: unknown[]; [key: string]: unknown }
) {
  return validateSectionItem(
    (item && typeof item === "object" ? item : {}) as Record<string, unknown>,
    itemsConfig as import("@/lib/sections/section-items-fields").SectionItemsConfig
  );
}
