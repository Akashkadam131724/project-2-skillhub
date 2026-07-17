"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SectionFrame from "./SectionFrame";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import CatalogPager from "@/components/catalog/CatalogPager";
import {
  VendorCatalogCard,
  ProductCatalogCard,
  TaxonomyCatalogCard,
} from "@/components/catalog/EntityCatalogCards";
import {
  fetchVendors,
  fetchProducts,
  fetchIndustries,
  fetchSkillingAreas,
} from "@/lib/api";

const DIRECTORY_META = {
  vendor: {
    label: "Vendors",
    searchPlaceholder: "Search vendors",
    empty: "No vendors match your search.",
    grid: "sm:grid-cols-2",
  },
  product: {
    label: "Products",
    searchPlaceholder: "Search products",
    empty: "No products match your search.",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
  },
  industry: {
    label: "Industries",
    searchPlaceholder: "Search industries",
    empty: "No industries match your search.",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
  },
  skilling_area: {
    label: "Skilling Areas",
    searchPlaceholder: "Search skilling areas",
    empty: "No skilling areas match your search.",
    grid: "sm:grid-cols-2 lg:grid-cols-3",
  },
};

function resolveDirectoryType(section_key, data, pageContext) {
  const fromData = String(data?.directory_type || data?.entity_type || "")
    .trim()
    .toLowerCase();
  if (DIRECTORY_META[fromData]) return fromData;
  if (fromData === "skilling-area") return "skilling_area";

  const fromCtx = String(pageContext?.directoryType || "").trim().toLowerCase();
  if (DIRECTORY_META[fromCtx]) return fromCtx;

  const key = String(section_key || "").toLowerCase();
  if (key.includes("vendor")) return "vendor";
  if (key.includes("product")) return "product";
  if (key.includes("industry")) return "industry";
  if (key.includes("skilling")) return "skilling_area";
  return "vendor";
}

async function fetchDirectory(type, { page, q, limit }) {
  const params = { page, limit, q, status: "active" };
  switch (type) {
    case "product":
      return fetchProducts(params);
    case "industry":
      return fetchIndustries({ ...params, limit: Math.max(limit, 50) });
    case "skilling_area":
      return fetchSkillingAreas({ ...params, limit: Math.max(limit, 50) });
    case "vendor":
    default:
      return fetchVendors(params);
  }
}

function DirectoryCards({ type, items }) {
  if (type === "product") {
    return items.map((product) => (
      <li key={String(product._id || product.id)}>
        <ProductCatalogCard product={product} />
      </li>
    ));
  }
  if (type === "industry") {
    return items.map((industry) => (
      <li key={String(industry._id || industry.id)}>
        <TaxonomyCatalogCard
          item={industry}
          href={`/industry/${industry.slug}`}
          metaLabel="Browse courses for this industry"
        />
      </li>
    ));
  }
  if (type === "skilling_area") {
    return items.map((area) => (
      <li key={String(area._id || area.id)}>
        <TaxonomyCatalogCard
          item={area}
          href={`/skilling-area/${area.slug}`}
          metaLabel="Browse courses in this skilling area"
        />
      </li>
    ));
  }
  return items.map((vendor) => (
    <li key={String(vendor._id || vendor.id)}>
      <VendorCatalogCard vendor={vendor} />
    </li>
  ));
}

function EntityDirectoryBody({
  type,
  meta,
  section_title,
  sub_title,
  cmsMode,
  onEditField,
  frameProps,
}) {
  const searchParams = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const q = searchParams.get("q") || "";

  const [result, setResult] = useState({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchDirectory(type, { page, q, limit: 24 });
        if (!alive) return;
        setResult(res || { data: [], total: 0, page: 1, totalPages: 1 });
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load directory");
        setResult({ data: [], total: 0, page: 1, totalPages: 1 });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [type, page, q]);

  const items = result.data || [];
  const total = result.total || 0;
  const title =
    (section_title && String(section_title).trim()) || `${meta.label} catalog`;
  const subtitle = (sub_title && String(sub_title).trim()) || "";

  return (
    <SectionFrame
      id="directory"
      title={title}
      subtitle={subtitle}
      eyebrow={meta.label}
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttonsFooter={false}
      {...frameProps}
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-[0_24px_70px_-48px_color-mix(in_srgb,var(--ink)_35%,transparent)] sm:p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-xl font-semibold text-ink dark:text-white">
            {loading
              ? "…"
              : error
                ? "—"
                : `${total.toLocaleString("en-US")} ${meta.label}`}
          </h3>
          <Suspense
            fallback={
              <div className="h-11 w-full max-w-md animate-pulse rounded-lg bg-slate-100" />
            }
          >
            <CatalogSearch placeholder={meta.searchPlaceholder} />
          </Suspense>
        </div>

        {error ? <p className="m-0 mb-4 text-sm text-rose-600">{error}</p> : null}

        {loading ? (
          <div className={`grid gap-3 ${meta.grid}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : !error && items.length === 0 ? (
          <p className="m-0 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
            {meta.empty}
          </p>
        ) : (
          <ul className={`m-0 grid list-none gap-3 p-0 ${meta.grid}`}>
            <DirectoryCards type={type} items={items} />
          </ul>
        )}

        <div className="mt-5">
          <Suspense fallback={null}>
            <CatalogPager
              page={result.page || page}
              totalPages={result.totalPages || 1}
            />
          </Suspense>
        </div>
      </div>
    </SectionFrame>
  );
}

/**
 * CMS-driven entity directory (vendors / products / industries / skilling areas).
 * `data.directory_type` selects which list to load.
 */
export default function EntityDirectorySection({
  section_title,
  sub_title,
  section_key = "entity_directory",
  data,
  pageContext,
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const type = useMemo(
    () => resolveDirectoryType(section_key, data, pageContext),
    [section_key, data, pageContext]
  );
  const meta = DIRECTORY_META[type] || DIRECTORY_META.vendor;

  return (
    <Suspense
      fallback={
        <SectionFrame
          id="directory"
          title={section_title || `${meta.label} catalog`}
          subtitle={sub_title || ""}
          eyebrow={meta.label}
          buttonsFooter={false}
          {...frameProps}
        >
          <div className="h-40 animate-pulse rounded-[1.25rem] bg-slate-200/60 dark:bg-slate-800" />
        </SectionFrame>
      }
    >
      <EntityDirectoryBody
        type={type}
        meta={meta}
        section_title={section_title}
        sub_title={sub_title}
        cmsMode={cmsMode}
        onEditField={onEditField}
        frameProps={frameProps}
      />
    </Suspense>
  );
}
