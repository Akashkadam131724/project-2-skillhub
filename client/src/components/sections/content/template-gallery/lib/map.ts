import { mediaUrl } from "@/lib/api/cms-api";
import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TemplateGalleryUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  image_url?: string;
  value?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isTemplateGalleryItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    mediaUrl(mapped.image_url) ||
      String(mapped.value || "").trim() ||
      String(mapped.title || itemTitle(mapped) || "").trim() ||
      String(mapped.subtitle || "").trim() ||
      !isRichTextEmpty(mapped.body)
  );
}

export function toTemplateGalleryUiItems(
  mappingItems: MappingItem[]
): TemplateGalleryUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    imageUrl: mediaUrl(item.image_url),
    category: item.value,
    title: item.title || itemTitle(item),
    subtitle: item.subtitle,
    body: item.body,
    large: i % 5 === 0,
  }));
}

export function resolveTemplateGalleryUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TemplateGalleryUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTemplateGalleryItemShowable);
  return toTemplateGalleryUiItems(list);
}
