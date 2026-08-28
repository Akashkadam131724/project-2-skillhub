import type { CatalogPageContext } from "./types";

/** Build locked catalog filters from entity pageContext */
export function catalogBaseParamsFromContext(
  pageContext?: CatalogPageContext | null
): Record<string, string> {
  const ctx = pageContext || {};
  if (ctx.catalogBaseParams) return ctx.catalogBaseParams;

  const entityId = ctx.entityId;
  const entityType = ctx.entityType;
  if (!entityId || !entityType) return {};

  switch (entityType) {
    case "vendor":
      return { vendor: String(entityId) };
    case "product":
      return {
        product: String(entityId),
        ...(ctx.vendorId ? { vendor: String(ctx.vendorId) } : {}),
      };
    case "industry":
      return { industry: String(entityId) };
    case "skilling_area":
      return { skillingArea: String(entityId) };
    default:
      return {};
  }
}

export function catalogHideKeysFromContext(
  pageContext?: CatalogPageContext | null
): string[] {
  const ctx = pageContext || {};
  if (ctx.catalogHideFilterKeys) return ctx.catalogHideFilterKeys;
  return Object.keys(catalogBaseParamsFromContext(ctx));
}
