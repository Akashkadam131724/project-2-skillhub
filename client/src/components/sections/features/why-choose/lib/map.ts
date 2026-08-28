import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import type { WhyChooseUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  body?: string;
  subtitle?: string;
  image_url?: string;
  icon?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isWhyChooseShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  return Boolean(String(itemTitle(item as MappingItem) || "").trim());
}

export function toWhyChooseUiItems(
  mappingItems: MappingItem[]
): WhyChooseUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item),
    body: String(item.body || item.subtitle || ""),
    imageUrl: mediaUrl(item.image_url || item.icon || "") || undefined,
  }));
}

export function resolveWhyChooseUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): WhyChooseUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isWhyChooseShowable);
  return toWhyChooseUiItems(list);
}
