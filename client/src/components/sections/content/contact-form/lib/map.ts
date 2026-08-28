import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { ContactChannelUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  href?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isContactChannelShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    String(itemTitle(mapped) || mapped.title || "").trim() &&
      String(mapped.subtitle || "").trim()
  );
}

export function toContactChannelUiItems(
  mappingItems: MappingItem[]
): ContactChannelUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    icon: item.icon,
    title: itemTitle(item) || item.title,
    subtitle: item.subtitle,
    body: item.body,
    href: item.href,
  }));
}

export function resolveContactChannelUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): ContactChannelUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isContactChannelShowable);
  return toContactChannelUiItems(list);
}
