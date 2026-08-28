import { groupItemsByTabs } from "@/lib/sections/item-types";
import { mediaUrl } from "@/lib/api/cms-api";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TabChildUiItem, TabUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  body?: string;
  image_url?: string;
  href?: string;
  label?: string;
  buttons?: unknown[];
  children?: MappingItem[];
  status?: boolean;
  [key: string]: unknown;
};

function mapChild(child: MappingItem, index: number): TabChildUiItem {
  return {
    id: String(child._id || child.id || index),
    title: String(child.title || ""),
    subtitle: String(child.subtitle || ""),
    body: String(child.body || ""),
    imageUrl: mediaUrl(child.image_url || "") || undefined,
    href: String(child.href || ""),
    label: String(child.label || ""),
    buttons: Array.isArray(child.buttons) ? child.buttons : [],
  };
}

export function isTabChildShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  const hasTitle = Boolean(String(row.title || "").trim());
  const hasSubtitle = Boolean(String(row.subtitle || "").trim());
  const hasBody = !isRichTextEmpty(row.body);
  const hasImage = Boolean(mediaUrl(row.image_url || ""));
  const hasHref = Boolean(String(row.href || "").trim());
  return hasTitle || hasSubtitle || hasBody || hasImage || hasHref;
}

export function isNestedTabShowable(tab: unknown): boolean {
  if (!tab || (tab as MappingItem).status === false) return false;
  const row = tab as MappingItem;
  const hasTitle = Boolean(String(row.title || "").trim());
  const hasValue = Boolean(String(row.value || "").trim());
  const hasSubtitle = Boolean(String(row.subtitle || "").trim());
  const hasBody = !isRichTextEmpty(row.body);
  const hasImage = Boolean(mediaUrl(row.image_url || ""));
  const children = Array.isArray(row.children) ? row.children : [];
  return (
    hasTitle ||
    hasValue ||
    hasSubtitle ||
    hasBody ||
    hasImage ||
    children.some(isTabChildShowable)
  );
}

export function toTabUiItems(mappingItems: unknown): TabUiItem[] {
  const tabs = groupItemsByTabs(mappingItems) as MappingItem[];
  return tabs.map((tab, i) => ({
    id: String(tab._id || tab.id || i),
    title: String(tab.title || ""),
    subtitle: String(tab.subtitle || ""),
    value: String(tab.value || ""),
    body: String(tab.body || ""),
    imageUrl: mediaUrl(tab.image_url || "") || undefined,
    buttons: Array.isArray(tab.buttons) ? tab.buttons : [],
    children: (tab.children || []).map(mapChild),
  }));
}

export function resolveTabUiItems(
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): TabUiItem[] {
  const tabs = toTabUiItems(mappingItems);
  if (options.cmsMode) return tabs;
  return tabs.filter(isNestedTabShowable);
}
