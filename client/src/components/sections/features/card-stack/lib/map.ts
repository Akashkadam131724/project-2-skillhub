import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { CardStackUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  image_url?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isCardStackItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    mediaUrl(mapped.image_url) ||
      String(mapped.value || "").trim() ||
      String(mapped.title || itemTitle(mapped) || "").trim() ||
      String(mapped.subtitle || "").trim() ||
      !isRichTextEmpty(mapped.body)
  );
}

export function toCardStackUiItems(
  mappingItems: MappingItem[]
): CardStackUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    imageUrl: mediaUrl(item.image_url) || undefined,
    value: item.value,
    title: item.title || itemTitle(item),
    subtitle: item.subtitle,
    body: item.body,
  }));
}

export function resolveCardStackUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): CardStackUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isCardStackItemShowable);
  return toCardStackUiItems(list);
}
