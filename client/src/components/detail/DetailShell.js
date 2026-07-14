import Link from "next/link";
import PageBanner from "@/components/PageBanner";
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

export function DetailShell({
  crumbs = [],
  title,
  subtitle,
  logo,
  badge,
  ctaHref = "/course-catalog",
  ctaLabel = "Explore Solutions",
  flush = false,
  children,
}) {
  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      <PageBanner
        eyebrow={badge || ""}
        title={title}
        description={subtitle}
        logo={logo}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
      />

      {flush ? (
        children
      ) : (
        <SectionWrapper className="py-6 pb-16">{children}</SectionWrapper>
      )}
    </>
  );
}

export function DetailSection({ title, children, action }) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="m-0 text-xl font-bold text-ink dark:text-white">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ message }) {
  return (
    <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950">
      {message}
    </p>
  );
}

export function NotFoundState({ entity = "Page" }) {
  return (
    <>
      <PageBanner
        title={`${entity} not found`}
        description="Check the URL or browse the catalog for available training."
        ctaLabel="Browse catalog"
        ctaHref="/course-catalog"
      />
      <SectionWrapper className="max-w-[720px] py-10 text-center">
        <Link
          href="/course-catalog"
          className="inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white no-underline"
        >
          Browse catalog
        </Link>
      </SectionWrapper>
    </>
  );
}

export function ProductCard({ product }) {
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
      {product.category && (
        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {product.category}
        </span>
      )}
    </Link>
  );
}
