import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { LearningPathStepUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  value?: string | number;
  title?: string;
  subtitle?: string;
  body?: string;
  buttons?: unknown[];
  status?: boolean;
  [key: string]: unknown;
};

export function isLearningPathStepShowable(item: unknown): boolean {
  if (!item || (item as MappingItem).status === false) return false;
  const row = item as MappingItem;
  const title = String(row.title || itemTitle(row) || "").trim();
  const subtitle = String(row.subtitle || "").trim();
  const body = String(row.body || "");
  return Boolean(title || subtitle || !isRichTextEmpty(body));
}

export function toLearningPathStepUiItems(
  mappingItems: MappingItem[]
): LearningPathStepUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    stepNumber: item.value ?? i + 1,
    title: String(item.title || itemTitle(item) || ""),
    subtitle: String(item.subtitle || ""),
    body: String(item.body || ""),
    buttons: Array.isArray(item.buttons) ? item.buttons : undefined,
  }));
}

export function resolveLearningPathStepUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): LearningPathStepUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isLearningPathStepShowable);
  return toLearningPathStepUiItems(list);
}
