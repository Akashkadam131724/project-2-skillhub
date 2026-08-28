import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { ComparisonUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  label?: string;
  value?: string;
  subtitle?: string;
  body?: string;
  buttons?: unknown[];
  [key: string]: unknown;
};

export function isComparisonItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const row = item as MappingItem;
  const option = String(itemTitle(row) || row.label || "").trim();
  const highlight = String(row.value || row.subtitle || "").trim();
  if (option || highlight) return true;
  return !isRichTextEmpty(row.body);
}

export function toComparisonUiItems(
  mappingItems: MappingItem[]
): ComparisonUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    option: itemTitle(item) || item.label,
    highlight: item.value || item.subtitle,
    notes: item.body,
    buttons: Array.isArray(item.buttons) ? item.buttons : [],
  }));
}

export function resolveComparisonUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): ComparisonUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isComparisonItemShowable);
  return toComparisonUiItems(list);
}
