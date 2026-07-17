"use client";

import Link from "next/link";
import { mediaAlt } from "@/lib/media-alt";

export function VendorCatalogCard({ vendor }) {
  const logo = vendor.logoUrl || vendor.vendorCatalogueLogo;
  return (
    <Link
      href={`/vendor/${vendor.slug}`}
      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950"
    >
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={mediaAlt(vendor, "Vendor logo")}
            className="max-h-10 max-w-[3.25rem] object-contain"
          />
        ) : (
          <span className="text-sm font-bold text-slate-400">
            {(vendor.name || "?").slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="m-0 text-base font-bold text-ink dark:text-white">
          {vendor.name}
        </h3>
        <p className="mt-1 mb-0 line-clamp-2 text-sm text-slate-500">
          {vendor.shortDescription || vendor.description || "Training vendor"}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
          {typeof vendor.productCount === "number" && (
            <span>{vendor.productCount.toLocaleString()} products</span>
          )}
          {typeof vendor.courseCount === "number" && (
            <span>{vendor.courseCount.toLocaleString()} courses</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCatalogCard({ product }) {
  const vendor = product.vendor;
  const vendorName = typeof vendor === "object" ? vendor?.name : null;
  const vendorSlug = typeof vendor === "object" ? vendor?.slug : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950"
    >
      <h3 className="m-0 text-base font-bold text-ink dark:text-white">
        {product.name}
      </h3>
      <p className="mt-2 mb-0 line-clamp-2 text-sm text-slate-500">
        {product.description || "Training product"}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {vendorName &&
          (vendorSlug ? (
            <span className="text-xs font-semibold text-brand">{vendorName}</span>
          ) : (
            <span className="text-xs font-medium text-slate-500">
              {vendorName}
            </span>
          ))}
        {product.category && (
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {product.category}
          </span>
        )}
      </div>
    </Link>
  );
}

export function TaxonomyCatalogCard({ item, href, metaLabel }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950"
    >
      <h3 className="m-0 text-base font-bold text-ink dark:text-white">
        {item.name}
      </h3>
      <p className="mt-2 mb-0 line-clamp-2 text-sm text-slate-500">
        {item.description || metaLabel || "Browse related courses"}
      </p>
    </Link>
  );
}
