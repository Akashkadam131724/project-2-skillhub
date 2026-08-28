/**
 * Which mapping `items[]` fields each section’s UI uses — drives the CMS form.
 * Field defs: { key, type, label, required?, options?, placeholder?, hint?,
 *   minLength?, maxLength?, min?, max?, pattern?, format?, errors? }
 * Types: text | textarea | richtext | url | image | select | radio | bg_color | buttons
 * Formats: url | email | tel | slug
 */

import { SECTION_COMPONENT_ITEM_CONFIGS } from "./configs/index.js";

/** Fallback when DB render_key is unset — keep in sync with section.catalog.js */
const BEHAVIOR_ALIASES = {
  page_testimonials: "customer_testimonials",
  partners: "partners_marquee",
  tabs_vertical: "feature_tabs",
};

/** Resolve component + CMS config key from catalog key and optional render_key */
export function resolveSectionBehaviorKey(sectionKey, renderKey) {
  const k = String(sectionKey || "").toLowerCase();
  const r = String(renderKey || "").toLowerCase().trim();
  if (r) return r;
  return BEHAVIOR_ALIASES[k] || k;
}

export const SECTION_ITEMS_CONFIG = {
  ...SECTION_COMPONENT_ITEM_CONFIGS,
};

export function sectionUsesItems(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return Boolean(SECTION_ITEMS_CONFIG[behavior]);
}

export function getSectionItemsConfig(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return SECTION_ITEMS_CONFIG[behavior] || null;
}

export {
  getItemFieldDefs,
  getItemFieldKeys,
  validateSectionItem,
  validateItemFields,
  buildItemFieldsZodSchema,
  itemField,
} from "@/lib/sections/section-items-fields";

/** Alias — item-driven sections require items on the public page */
export function sectionRequiresItems(key, renderKey) {
  return sectionUsesItems(key, renderKey);
}
