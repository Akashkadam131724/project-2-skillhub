import { mediaUrl } from "@/lib/api/cms-api";
import { VENDOR_LINKS_GRID_STATIC_LINKS } from "./static-demo";
import type { VendorLinksGridLink } from "./types";

function itemSortOrder(item: Record<string, unknown>, index: number) {
  const raw = item.sort_order ?? item.sortOrder;
  const n = Number(raw);
  return Number.isFinite(n) ? n : index;
}

function itemLabel(item: Record<string, unknown>) {
  return String(
    item.title || item.label || item.button_name || item.name || ""
  ).trim();
}

function itemHref(item: Record<string, unknown>) {
  return String(
    item.href || item.target_url || item.button_url || item.url || ""
  ).trim();
}

function itemIconUrl(item: Record<string, unknown>) {
  const raw = String(
    item.image_url || item.icon_url || item.icon || ""
  ).trim();
  return raw ? mediaUrl(raw) : "";
}

export function isVendorLinkGridItemShowable(item: unknown) {
  if (!item || typeof item !== "object") return false;
  const row = item as Record<string, unknown>;
  if (row.status === false) return false;
  return Boolean(itemLabel(row) && itemHref(row));
}

export function mapVendorLinkGridItem(
  item: unknown,
  index: number
): VendorLinksGridLink | null {
  if (!isVendorLinkGridItemShowable(item)) return null;
  const row = item as Record<string, unknown>;
  const id = row.id ?? row._id ?? `vendor-link-${index}`;
  return {
    id: typeof id === "string" || typeof id === "number" ? id : String(id),
    label: itemLabel(row),
    href: itemHref(row),
    iconUrl: itemIconUrl(row) || undefined,
    sortOrder: itemSortOrder(row, index),
  };
}

export function resolveVendorLinksGridLinks(
  items?: unknown[],
  { fallbackStatic = false, cmsMode = false } = {}
): VendorLinksGridLink[] {
  const mapped = (Array.isArray(items) ? items : [])
    .map((item, index) => mapVendorLinkGridItem(item, index))
    .filter((item): item is VendorLinksGridLink => Boolean(item));

  if (mapped.length) return mapped;
  if (fallbackStatic && !cmsMode) return VENDOR_LINKS_GRID_STATIC_LINKS;
  return [];
}
