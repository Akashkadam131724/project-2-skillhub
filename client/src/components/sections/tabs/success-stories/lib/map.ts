import { itemTitle, resolveSectionItems } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import type { SuccessStoryUiItem } from "../../shared/lib/types";

type MappingItem = {
  _id?: string;
  id?: string;
  icon?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  image_url?: string;
  href?: string;
  bg_color?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

export function isSuccessStoryShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  return Boolean(
    String(row.label || itemTitle(row) || row.title || "").trim()
  );
}

export function toSuccessStoryUiItems(
  mappingItems: MappingItem[]
): SuccessStoryUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    icon: String(item.icon || ""),
    label: String(item.label || itemTitle(item) || ""),
    title: String(item.title || ""),
    subtitle: String(item.subtitle || ""),
    imageUrl: mediaUrl(item.image_url || "") || undefined,
    logoUrl: mediaUrl(item.value || "") || undefined,
    videoUrl: String(item.href || "").trim() || undefined,
    gradient: String(item.bg_color || "").trim() || undefined,
    buttons: Array.isArray(item.buttons) ? item.buttons : [],
  }));
}

export function resolveSuccessStoryUiItems(
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): SuccessStoryUiItem[] {
  const resolved = resolveSectionItems(mappingItems) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isSuccessStoryShowable);
  return toSuccessStoryUiItems(list);
}
