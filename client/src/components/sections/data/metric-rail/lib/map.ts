import {
  itemStatLabel,
  itemStatValue,
  resolveItemsForSection,
} from "@/lib/sections/item-types";
import { isStatMetricShowable } from "../../shared/lib/stat-metric";
import type { MetricRailUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  value?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  status?: boolean;
  [key: string]: unknown;
};

export function isMetricRailItemShowable(item: unknown): boolean {
  return isStatMetricShowable(item);
}

export function toMetricRailUiItems(
  mappingItems: MappingItem[]
): MetricRailUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    value: itemStatValue(item) || String(item.value || ""),
    label:
      itemStatLabel(item) ||
      String(item.label || item.title || item.subtitle || ""),
  }));
}

export function resolveMetricRailUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): MetricRailUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isMetricRailItemShowable);
  return toMetricRailUiItems(list);
}
