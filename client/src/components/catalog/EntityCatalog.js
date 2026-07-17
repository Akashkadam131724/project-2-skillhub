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

export {
  VendorCatalogCard,
  ProductCatalogCard,
  TaxonomyCatalogCard,
} from "./EntityCatalogCards";
