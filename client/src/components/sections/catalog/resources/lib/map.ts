import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { ResourcesUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  label?: string;
  body?: string;
  subtitle?: string;
  href?: string;
  buttons?: unknown[];
  [key: string]: unknown;
};

export function isResourceItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const row = item as MappingItem;
  return Boolean(String(itemTitle(row) || row.label || "").trim());
}

export function toResourcesUiItems(
  mappingItems: MappingItem[]
): ResourcesUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item) || item.label,
    body: item.body || item.subtitle,
    href: item.href,
    buttons: Array.isArray(item.buttons) ? item.buttons : [],
  }));
}

export function resolveResourcesUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): ResourcesUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isResourceItemShowable);
  return toResourcesUiItems(list);
}
