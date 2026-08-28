import {
  itemStatLabel,
  itemStatValue,
  resolveItemsForSection,
} from "@/lib/sections/item-types";
import { isStatMetricShowable } from "../../shared/lib/stat-metric";
import type { StatUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  value?: string;
  label?: string;
  title?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isStatShowable(item: unknown): boolean {
  return isStatMetricShowable(item);
}

export function toStatUiItems(mappingItems: MappingItem[]): StatUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    value: itemStatValue(item),
    label: itemStatLabel(item),
  }));
}

export function resolveStatUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): StatUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isStatShowable);
  return toStatUiItems(list);
}
