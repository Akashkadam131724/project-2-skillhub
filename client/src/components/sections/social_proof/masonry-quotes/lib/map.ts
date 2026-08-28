import { mediaUrl } from "@/lib/api/cms-api";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { MasonryQuoteUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  body?: string;
  subtitle?: string;
  label?: string;
  value?: string;
  image_url?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isMasonryQuoteShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  const quote = String(row.body || "").trim();
  const title = String(row.title || "").trim();
  return Boolean(!isRichTextEmpty(quote) || title);
}

export function toMasonryQuoteUiItems(
  mappingItems: MappingItem[]
): MasonryQuoteUiItem[] {
  return mappingItems.map((item, i) => {
    const photo = mediaUrl(item.image_url);
    const author = String(item.subtitle || item.label || "").trim();
    return {
      id: String(item._id || item.id || i),
      quote: String(item.body || ""),
      author: author || "Customer",
      role: String(item.value || "").trim() || undefined,
      avatarUrl: photo || undefined,
      avatarInitial: (item.subtitle || item.label || "?").slice(0, 1),
    };
  });
}

export function resolveMasonryQuoteUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): MasonryQuoteUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isMasonryQuoteShowable);
  return toMasonryQuoteUiItems(list);
}
