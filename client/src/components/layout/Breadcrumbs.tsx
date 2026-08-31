import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import type { BreadcrumbsProps } from "./types";

export default function Breadcrumbs({ crumbs = [] }: BreadcrumbsProps) {
  if (!crumbs.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90"
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
