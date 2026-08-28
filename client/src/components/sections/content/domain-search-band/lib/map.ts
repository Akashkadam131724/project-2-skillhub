import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { DomainChipUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  value?: string;
  label?: string;
  title?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isDomainChipShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    String(mapped.value || mapped.label || itemTitle(mapped) || mapped.title || "").trim()
  );
}

export function toDomainChipUiItems(
  mappingItems: MappingItem[]
): DomainChipUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    label: String(
      item.value || item.label || itemTitle(item) || item.title || ""
    ).trim(),
  }));
}

export function resolveDomainChipUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): DomainChipUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isDomainChipShowable);
  return toDomainChipUiItems(list);
}
