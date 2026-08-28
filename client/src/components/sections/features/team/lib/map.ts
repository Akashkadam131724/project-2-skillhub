import { mediaUrl } from "@/lib/api/cms-api";
import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TeamUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  image_url?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isTeamItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const mapped = item as MappingItem;
  return Boolean(
    mediaUrl(mapped.image_url) &&
      String(mapped.title || itemTitle(mapped) || "").trim()
  );
}

export function toTeamUiItems(mappingItems: MappingItem[]): TeamUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    imageUrl: mediaUrl(item.image_url) || undefined,
    name: item.title || itemTitle(item) || undefined,
    role: item.subtitle || undefined,
    body: !isRichTextEmpty(item.body) ? String(item.body) : undefined,
  }));
}

export function resolveTeamUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TeamUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTeamItemShowable);
  return toTeamUiItems(list);
}
