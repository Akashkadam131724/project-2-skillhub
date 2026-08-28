import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { FormHighlightUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isFormHighlightShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(String(itemTitle(mapped) || mapped.title || "").trim());
}

export function toFormHighlightUiItems(
  mappingItems: MappingItem[]
): FormHighlightUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item) || item.title,
    subtitle: item.subtitle,
  }));
}

export function resolveFormHighlightUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): FormHighlightUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isFormHighlightShowable);
  return toFormHighlightUiItems(list);
}
