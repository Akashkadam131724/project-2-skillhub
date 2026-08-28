import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import type { MediaMosaicTileUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  image_url?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

export function isMediaMosaicTileShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  return Boolean(
    mediaUrl(row.image_url || row.image) ||
      String(row.title || itemTitle(row) || "").trim() ||
      String(row.subtitle || "").trim()
  );
}

export function toMediaMosaicTileUiItems(
  mappingItems: MappingItem[]
): MediaMosaicTileUiItem[] {
  const total = mappingItems.length;
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    imageUrl: mediaUrl(item.image_url || item.image) || undefined,
    title: String(item.title || itemTitle(item) || ""),
    subtitle: String(item.subtitle || ""),
    buttons: Array.isArray(item.buttons) ? item.buttons : undefined,
    featured: i === 0 && total >= 3,
  }));
}

export function resolveMediaMosaicTileUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): MediaMosaicTileUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isMediaMosaicTileShowable);
  return toMediaMosaicTileUiItems(list);
}
