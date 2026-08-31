import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PageBanner from "@/components/layout/PageBanner";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type {
  DetailSectionProps,
  DetailShellProps,
  EmptyStateProps,
  NotFoundStateProps,
} from "./types";

export function DetailShell({
  crumbs = [],
  title,
  subtitle,
  logo,
  badge,
  ctaHref = "/courses",
  ctaLabel = "Explore Solutions",
  flush = false,
  children,
}: DetailShellProps) {
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

export function DetailSection({ title, children, action }: DetailSectionProps) {
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

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950">
      {message}
    </p>
  );
}

export function NotFoundState({ entity = "Page" }: NotFoundStateProps) {
  return (
    <>
      <PageBanner
        title={`${entity} not found`}
        description="Check the URL or browse the catalog for available training."
        ctaLabel="Browse catalog"
        ctaHref="/courses"
      />
      <SectionWrapper className="max-w-[720px] py-10 text-center">
        <Link
          href="/courses"
          className="inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white no-underline"
        >
          Browse catalog
        </Link>
      </SectionWrapper>
    </>
  );
}
