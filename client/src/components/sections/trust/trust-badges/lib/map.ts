import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import type { TrustBadgeUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  image_url?: string;
  icon?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isTrustBadgeShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  const hasImage = Boolean(mediaUrl(row.image_url || row.icon || ""));
  const hasTitle = Boolean(String(itemTitle(row) || row.title || "").trim());
  const hasSubtitle = Boolean(String(row.subtitle || "").trim());
  const hasValue = Boolean(String(row.value || "").trim());
  return hasImage || hasTitle || hasSubtitle || hasValue;
}

export function toTrustBadgeUiItems(
  mappingItems: MappingItem[]
): TrustBadgeUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item) || String(item.title || ""),
    subtitle: String(item.subtitle || ""),
    value: String(item.value || ""),
    imageUrl: mediaUrl(item.image_url || item.icon || "") || undefined,
  }));
}

export function resolveTrustBadgeUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TrustBadgeUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTrustBadgeShowable);
  return toTrustBadgeUiItems(list);
}
