import { mediaUrl } from "@/lib/api/cms-api";
import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { PillarDestinationsUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  image_url?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  href?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isPillarDestinationsItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    mediaUrl(mapped.image_url) ||
      String(mapped.title || itemTitle(mapped) || "").trim() ||
      String(mapped.subtitle || "").trim() ||
      !isRichTextEmpty(mapped.body) ||
      String(mapped.href || "").trim()
  );
}

export function toPillarDestinationsUiItems(
  mappingItems: MappingItem[]
): PillarDestinationsUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    imageUrl: mediaUrl(item.image_url) || undefined,
    imageAlt: mediaAlt(item, "Destination"),
    title: item.title || itemTitle(item) || undefined,
    subtitle: item.subtitle || undefined,
    body: !isRichTextEmpty(item.body) ? String(item.body) : undefined,
    href: String(item.href || "").trim() || undefined,
  }));
}

export function resolvePillarDestinationsUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): PillarDestinationsUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isPillarDestinationsItemShowable);
  return toPillarDestinationsUiItems(list);
}
