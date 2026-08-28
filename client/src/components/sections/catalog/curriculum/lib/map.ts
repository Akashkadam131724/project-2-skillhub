import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { CurriculumUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  [key: string]: unknown;
};

export function isCurriculumItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  return Boolean(String(itemTitle(item) || "").trim());
}

export function toCurriculumUiItems(
  mappingItems: MappingItem[]
): CurriculumUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item),
  }));
}

export function resolveCurriculumUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): CurriculumUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isCurriculumItemShowable);
  return toCurriculumUiItems(list);
}
