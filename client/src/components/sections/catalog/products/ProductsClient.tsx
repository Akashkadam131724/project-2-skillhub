"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import DsButton from "@/components/ui/DsButton";
import { EmptyState } from "@/components/detail/DetailShell";
import { fetchProductsByVendor } from "@/lib/api";
import ProductsUi from "./ProductsUi";
import { PRODUCTS_INITIAL_VISIBLE } from "./lib/constants";
import {
  excludeProductIdFromContext,
  hasProductsContext,
  vendorIdFromContext,
} from "./lib/context";
import type { ProductsSectionProps } from "./lib/types";

export default function ProductsClient({
  section_title,
  sub_title,
  pageContext,
  cmsMode = false,
  id,
  titleSlot,
  subtitleSlot,
}: ProductsSectionProps & {
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
}) {
  const vendorId = useMemo(
    () => vendorIdFromContext(pageContext),
    [pageContext]
  );
  const excludeProductId = useMemo(
    () => excludeProductIdFromContext(pageContext),
    [pageContext]
  );
  const hasContext = hasProductsContext(pageContext);

  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(hasContext);
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
        let list = (res.data || []) as Record<string, unknown>[];
        if (excludeProductId) {
          list = list.filter(
            (p) => String(p._id || p.id) !== excludeProductId
          );
        }
        setProducts(list);
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [vendorId, excludeProductId]);

  if (!cmsMode && !hasContext) return null;
  if (!cmsMode && !loading && !error && products.length === 0) return null;

  const hasMore = products.length > PRODUCTS_INITIAL_VISIBLE;
  const visible = expanded
    ? products
    : products.slice(0, PRODUCTS_INITIAL_VISIBLE);
  const remaining = products.length - PRODUCTS_INITIAL_VISIBLE;

  let body: React.ReactNode;
  if (!hasContext) {
    body = <EmptyState message="No vendor context available for products." />;
  } else if (loading) {
    body = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[1.35rem] bg-slate-200/70 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  } else if (error) {
    body = <p className="m-0 text-sm text-rose-600">{error}</p>;
  } else if (products.length === 0) {
    body = <EmptyState message="No products to show yet." />;
  } else {
    body = (
      <div>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <li key={String(product._id || product.id)}>
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>
        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <DsButton
              label={
                expanded ? "Show less" : `View more (${remaining} more)`
              }
              variant="outline"
              size="md"
              shape="rounded"
              icon="none"
              onClick={() => setExpanded((v) => !v)}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ProductsUi
      id={id}
      title={titleSlot ? undefined : section_title}
      subtitle={subtitleSlot ? undefined : sub_title}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
    >
      {body}
    </ProductsUi>
  );
}
