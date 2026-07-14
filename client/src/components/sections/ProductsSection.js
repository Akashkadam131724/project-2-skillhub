"use client";

import { useEffect, useMemo, useState } from "react";
import SectionFrame from "./SectionFrame";
import {
  EmptyState,
  ProductCard,
} from "@/components/detail/DetailShell";
import { fetchProductsByVendor } from "@/lib/api";

/** Initial visible count — 2 rows on lg (3 cols) / 3 rows on sm (2 cols) */
const INITIAL_VISIBLE = 6;

/** Resolve which vendor's products to load from pageContext */
function vendorIdFromContext(pageContext = {}) {
  if (pageContext.vendorId) return String(pageContext.vendorId);
  if (pageContext.entityType === "vendor" && pageContext.entityId) {
    return String(pageContext.entityId);
  }
  return null;
}

/**
 * Products grid — CMS fields: section_title, sub_title, section_bg_img.
 * Fetches products for the current vendor (vendor page) or sibling products
 * (product page via pageContext.vendorId).
 */
export default function ProductsSection({
  section_title,
  sub_title,
  pageContext,
  ...frameProps
}) {
  const vendorId = useMemo(
    () => vendorIdFromContext(pageContext),
    [pageContext]
  );
  const excludeProductId =
    pageContext?.entityType === "product" && pageContext?.entityId
      ? String(pageContext.entityId)
      : null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(vendorId));
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!vendorId) {
      setProducts([]);
      setLoading(false);
      setError("");
      return;
    }

    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setExpanded(false);
      try {
        const res = await fetchProductsByVendor(vendorId, {
          limit: 24,
          status: "active",
        });
        if (!alive) return;
        let list = res.data || [];
        if (excludeProductId) {
          list = list.filter(
            (p) => String(p._id || p.id) !== excludeProductId
          );
        }
        setProducts(list);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [vendorId, excludeProductId]);

  const hasMore = products.length > INITIAL_VISIBLE;
  const visible = expanded ? products : products.slice(0, INITIAL_VISIBLE);
  const remaining = products.length - INITIAL_VISIBLE;

  return (
    <SectionFrame title={section_title} subtitle={sub_title} {...frameProps}>
      {!vendorId ? (
        <EmptyState message="No vendor context available for products." />
      ) : loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800" />
      ) : error ? (
        <p className="m-0 text-sm text-rose-600">{error}</p>
      ) : products.length === 0 ? (
        <EmptyState message="No products to show yet." />
      ) : (
        <div>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <li key={String(product._id || product.id)}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand"
              >
                {expanded ? (
                  <>Show less</>
                ) : (
                  <>
                    View more
                    <span className="font-normal text-slate-500">
                      ({remaining} more)
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </SectionFrame>
  );
}
