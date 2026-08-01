/** Shared anchor id for catalog search, filters, and pagination scroll targets. */
export const CATALOG_SCROLL_ANCHOR_ID = "catalog-scroll-anchor";

/** Scroll to the catalog toolbar with sticky header + in-page nav offset (CSS var). */
export function scrollToCatalogAnchor(
  targetId = CATALOG_SCROLL_ANCHOR_ID,
  behavior = "smooth"
) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior, block: "start" });
}
