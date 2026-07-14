import Link from "next/link";
import { Suspense } from "react";
import PageBanner from "@/components/PageBanner";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import CatalogPager from "@/components/catalog/CatalogPager";
import SectionWrapper from "@/components/sections/SectionWrapper";

function Breadcrumbs({ crumbs = [] }) {
  if (!crumbs.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <SectionWrapper className="flex flex-wrap items-center gap-2 py-3 text-sm text-slate-500">
        <Link href="/" className="no-underline hover:text-brand">
          Home
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.href || crumb.label} className="contents">
            <span aria-hidden="true">/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="no-underline hover:text-brand"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-700 dark:text-slate-300">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </SectionWrapper>
    </nav>
  );
}

/**
 * Shared list layout for vendor / product / skilling / industry catalogs.
 */
export default function EntityCatalog({
  crumbs = [],
  bannerTitle,
  bannerDescription,
  bannerCtaHref = "#catalog",
  bannerCtaLabel = "Browse catalog",
  catalogTitle,
  catalogSubtitle,
  heading,
  searchPlaceholder = "Search",
  total,
  totalLabel,
  error = "",
  page = 1,
  totalPages = 1,
  emptyMessage = "No results found.",
  children,
}) {
  const title =
    catalogTitle ||
    totalLabel ||
    heading ||
    crumbs.find((c) => !c.href)?.label ||
    "Catalog";

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      <PageBanner
        title={bannerTitle}
        description={bannerDescription}
        ctaLabel={bannerCtaLabel}
        ctaHref={bannerCtaHref}
      />

      <SectionWrapper id="catalog" className="py-6 pb-16">
        <header className="mb-8 text-center sm:mb-10">
          <h2 className="m-0 text-[1.75rem] leading-tight font-bold tracking-tight text-ink sm:text-3xl dark:text-white">
            {title}
          </h2>
          {catalogSubtitle && (
            <p className="mx-auto mt-3 mb-0 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
              {catalogSubtitle}
            </p>
          )}
        </header>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="m-0 text-xl font-bold text-ink dark:text-white">
            {error
              ? "—"
              : `${Number(total || 0).toLocaleString("en-US")} ${
                  totalLabel || heading
                }`}
          </h3>
          <Suspense
            fallback={
              <div className="h-11 w-full max-w-md animate-pulse rounded-lg bg-slate-100" />
            }
          >
            <CatalogSearch placeholder={searchPlaceholder} />
          </Suspense>
        </div>

        {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

        {!error && total === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950">
            {emptyMessage}
          </p>
        )}

        {children}

        <div className="mt-5">
          <Suspense fallback={null}>
            <CatalogPager page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </SectionWrapper>
    </>
  );
}

export function VendorCatalogCard({ vendor }) {
  const logo = vendor.logoUrl || vendor.vendorCatalogueLogo;
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950"
    >
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
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
      href={`/products/${product.slug}`}
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
            <span className="text-xs font-semibold text-brand">
              {vendorName}
            </span>
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

export function TaxonomyCatalogCard({
  item,
  href,
  metaLabel,
}) {
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
