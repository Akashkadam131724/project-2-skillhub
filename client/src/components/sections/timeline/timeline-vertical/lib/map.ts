import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TimelineStepUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

export function isTimelineStepShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  const hasTitle = Boolean(String(itemTitle(row) || row.title || "").trim());
  const hasSubtitle = Boolean(String(row.subtitle || "").trim());
  const hasBody = !isRichTextEmpty(row.body);
  return hasTitle || hasSubtitle || hasBody;
}

export function toTimelineStepUiItems(
  mappingItems: MappingItem[]
): TimelineStepUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item) || String(item.title || ""),
    subtitle: String(item.subtitle || ""),
    body: String(item.body || ""),
    buttons: Array.isArray(item.buttons) ? item.buttons : [],
  }));
}

export function resolveTimelineStepUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TimelineStepUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isTimelineStepShowable);
  return toTimelineStepUiItems(list);
}
