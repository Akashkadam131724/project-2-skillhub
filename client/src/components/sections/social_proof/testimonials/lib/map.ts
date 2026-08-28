import {
  itemAuthor,
  itemQuote,
  resolveItemsForSection,
} from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TestimonialUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  body?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isTestimonialShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const quote = itemQuote(item as MappingItem);
  const author = itemAuthor(item as MappingItem);
  return Boolean(
    !isRichTextEmpty(quote) || String(author || "").trim()
  );
}

export function toTestimonialUiItems(
  mappingItems: MappingItem[]
): TestimonialUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    quote: itemQuote(item) || String(item.body || ""),
    author: itemAuthor(item) || String(item.title || ""),
  }));
}

export function resolveTestimonialUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TestimonialUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTestimonialShowable);
  return toTestimonialUiItems(list);
}
