import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import type { TrainingOptionUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  body?: string;
  subtitle?: string;
  image_url?: string;
  icon?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

export function isTrainingOptionShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  return Boolean(String(itemTitle(item as MappingItem) || "").trim());
}

export function toTrainingOptionUiItems(
  mappingItems: MappingItem[]
): TrainingOptionUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item),
    body: String(item.body || item.subtitle || ""),
    imageUrl: mediaUrl(item.image_url || item.icon || "") || undefined,
    buttons: item.buttons,
  }));
}

export function resolveTrainingOptionUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TrainingOptionUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTrainingOptionShowable);
  return toTrainingOptionUiItems(list);
}
