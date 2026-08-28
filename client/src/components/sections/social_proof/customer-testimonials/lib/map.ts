import { mediaUrl } from "@/lib/api/cms-api";
import {
  itemAuthor,
  itemQuote,
  resolveItemsForSection,
} from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { CustomerTestimonialUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  body?: string;
  value?: string | number;
  label?: string;
  image_url?: string;
  icon?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isCustomerTestimonialShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const quote = itemQuote(item as MappingItem);
  return !isRichTextEmpty(quote);
}

export function toCustomerTestimonialUiItems(
  mappingItems: MappingItem[]
): CustomerTestimonialUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    quote: itemQuote(item) || String(item.body || ""),
    author: itemAuthor(item) || String(item.title || ""),
    logoUrl: mediaUrl(item.image_url || item.icon) || undefined,
    rating: item.value ?? item.label ?? 5,
    raw: item,
  }));
}

export function resolveCustomerTestimonialUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): CustomerTestimonialUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isCustomerTestimonialShowable);
  return toCustomerTestimonialUiItems(list);
}
