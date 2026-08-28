import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { BuilderFeatureCardUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isBuilderFeatureCardShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    String(mapped.value || "").trim() ||
      String(mapped.title || itemTitle(mapped) || "").trim() ||
      String(mapped.subtitle || "").trim() ||
      !isRichTextEmpty(mapped.body)
  );
}

export function toBuilderFeatureCardUiItems(
  mappingItems: MappingItem[]
): BuilderFeatureCardUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    value: item.value,
    title: item.title || itemTitle(item),
    subtitle: item.subtitle,
    body: item.body,
  }));
}

export function resolveBuilderFeatureCardUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): BuilderFeatureCardUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isBuilderFeatureCardShowable);
  return toBuilderFeatureCardUiItems(list);
}
