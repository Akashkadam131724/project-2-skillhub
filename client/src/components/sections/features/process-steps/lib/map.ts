import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { ProcessStepUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isProcessStepShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  return Boolean(String(itemTitle(item as MappingItem) || "").trim());
}

export function toProcessStepUiItems(
  mappingItems: MappingItem[]
): ProcessStepUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item) || String(item.title || ""),
    subtitle: String(item.subtitle || ""),
    body: String(item.body || ""),
  }));
}

export function resolveProcessStepUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): ProcessStepUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isProcessStepShowable);
  return toProcessStepUiItems(list);
}
