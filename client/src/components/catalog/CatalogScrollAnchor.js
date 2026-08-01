import { CATALOG_SCROLL_ANCHOR_ID } from "@/lib/catalog/scrollAnchor";

/**
 * Toolbar row anchor — accounts for site header + in-page nav via CSS scroll margin.
 */
export default function CatalogScrollAnchor({ children, className = "", id }) {
  return (
    <div
      id={id || CATALOG_SCROLL_ANCHOR_ID}
      className={`scroll-mt-[var(--catalog-scroll-offset)] ${className}`.trim()}
      style={{ scrollMarginTop: "var(--catalog-scroll-offset)" }}
    >
      {children}
    </div>
  );
}
