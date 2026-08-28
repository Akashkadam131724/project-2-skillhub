import { mediaUrl } from "@/lib/api/cms-api";
import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { FeatureSpotlightUiItem } from "./types";

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

export function isFeatureSpotlightItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(String(mapped.title || itemTitle(mapped) || "").trim());
}

export function toFeatureSpotlightUiItems(
  mappingItems: MappingItem[]
): FeatureSpotlightUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    imageUrl: mediaUrl(item.image_url) || undefined,
    imageAlt: mediaAlt(item, "Feature spotlight"),
    value: item.value || undefined,
    title: item.title || itemTitle(item) || undefined,
    subtitle: item.subtitle || undefined,
    body: !isRichTextEmpty(item.body) ? String(item.body) : undefined,
    large: i === 0,
  }));
}

export function resolveFeatureSpotlightUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): FeatureSpotlightUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isFeatureSpotlightItemShowable);
  return toFeatureSpotlightUiItems(list);
}
