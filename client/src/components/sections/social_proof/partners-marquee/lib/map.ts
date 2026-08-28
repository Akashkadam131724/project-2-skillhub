import { mediaUrl } from "@/lib/api/cms-api";
import {
  itemTitle,
  resolveItemsForSection,
} from "@/lib/sections/item-types";
import type { PartnerLogoUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  image_url?: string;
  icon?: string;
  href?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isPartnerLogoShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const src = mediaUrl((item as MappingItem).image_url || (item as MappingItem).icon);
  return Boolean(src);
}

export function toPartnerLogoUiItems(
  mappingItems: MappingItem[]
): PartnerLogoUiItem[] {
  const rows: PartnerLogoUiItem[] = [];
  mappingItems.forEach((item, i) => {
    const src = mediaUrl(item.image_url || item.icon);
    if (!src) return;
    rows.push({
      id: String(item._id || item.id || i),
      name: itemTitle(item) || String(item.title || ""),
      imageUrl: src,
      href: String(item.href || "").trim() || undefined,
    });
  });
  return rows;
}

export function resolvePartnerLogoUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): PartnerLogoUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isPartnerLogoShowable);
  return toPartnerLogoUiItems(list);
}
