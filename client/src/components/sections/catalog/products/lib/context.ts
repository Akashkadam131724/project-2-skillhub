import type { CatalogPageContext } from "../../shared/lib/types";
import type { ProductsSectionProps } from "./types";

export function vendorIdFromContext(
  pageContext?: CatalogPageContext | null
): string | null {
  const ctx = pageContext || {};
  if (ctx.vendorId) return String(ctx.vendorId);
  if (ctx.entityType === "vendor" && ctx.entityId) {
    return String(ctx.entityId);
  }
  return null;
}

export function excludeProductIdFromContext(
  pageContext?: CatalogPageContext | null
): string | null {
  const ctx = pageContext || {};
  if (ctx.entityType === "product" && ctx.entityId) {
    return String(ctx.entityId);
  }
  return null;
}

export function hasProductsContext(
  pageContext?: CatalogPageContext | null
): boolean {
  return Boolean(vendorIdFromContext(pageContext));
}

export function isProductsPlacementShowable(
  props: ProductsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  return hasProductsContext(props.pageContext);
}
