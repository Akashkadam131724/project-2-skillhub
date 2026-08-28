import { itemTitle, resolveItemsForSection } from "@/lib/sections/item-types";
import type { PricingTierUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  title?: string;
  value?: string;
  subtitle?: string;
  body?: string;
  label?: string;
  href?: string;
  icon?: string;
  buttons?: unknown[];
  [key: string]: unknown;
};

export function parsePlanFeatures(body?: string): string[] {
  return String(body || "")
    .replace(/<\/?p>/gi, "")
    .split(/<br\s*\/?>|[\n•]/)
    .map((s) => s.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
}

export function isFeaturedPlan(item: MappingItem, index: number): boolean {
  const label = String(item.label || "").toLowerCase();
  if (label === "popular") return true;
  if (String(item.value || "").toLowerCase().includes("popular")) return true;
  return index === 1;
}

export function isPricingTierShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const row = item as MappingItem;
  return (
    Boolean(String(itemTitle(row) || "").trim()) &&
    Boolean(String(row.value || "").trim())
  );
}

export function toPricingTierUiItems(
  mappingItems: MappingItem[]
): PricingTierUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    title: itemTitle(item),
    price: String(item.value || ""),
    period: item.subtitle,
    body: item.body,
    features: parsePlanFeatures(item.body),
    featured: isFeaturedPlan(item, i),
    href: item.href,
    ctaLabel: item.icon,
    buttons: Array.isArray(item.buttons) ? item.buttons : [],
  }));
}

export function resolvePricingTierUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): PricingTierUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isPricingTierShowable);
  return toPricingTierUiItems(list);
}
