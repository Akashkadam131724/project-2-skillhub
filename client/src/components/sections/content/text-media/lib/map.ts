import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { TextMediaUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  image_url?: string;
  value?: string;
  [key: string]: unknown;
};

function resolveMediaPosition(
  item: MappingItem,
  index: number
): "start" | "end" {
  const raw = String(item?.value || "")
    .trim()
    .toLowerCase();
  if (raw === "start" || raw === "left") return "start";
  if (raw === "end" || raw === "right") return "end";
  return index % 2 === 0 ? "end" : "start";
}

export function isTextMediaItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  return Boolean(String(itemTitle(item as MappingItem) || "").trim());
}

export function toTextMediaUiItems(
  mappingItems: MappingItem[]
): TextMediaUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item),
    subtitle: item.subtitle,
    body: item.body,
    imageUrl: item.image_url,
    mediaPosition: resolveMediaPosition(item, i),
  }));
}

export function resolveTextMediaUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TextMediaUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTextMediaItemShowable);
  return toTextMediaUiItems(list);
}
