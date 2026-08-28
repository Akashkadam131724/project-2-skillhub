import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import type { KeyBenefitsUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  body?: string;
  subtitle?: string;
  image_url?: string;
  image?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

export function isKeyBenefitShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const row = item as MappingItem;
  return (
    Boolean(String(itemTitle(row) || "").trim()) &&
    Boolean(String(row.image_url || row.image || "").trim())
  );
}

export function toKeyBenefitsUiItems(
  mappingItems: MappingItem[]
): KeyBenefitsUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item),
    body: String(item.body || item.subtitle || ""),
    imageUrl: mediaUrl(item.image_url || item.image || "") || undefined,
    buttons: item.buttons,
  }));
}

export function resolveKeyBenefitsUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): KeyBenefitsUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isKeyBenefitShowable);
  return toKeyBenefitsUiItems(list);
}
