import Link from "next/link";
import type { SectionLibraryBannerProps } from "./types";

export default function SectionLibraryBanner({
  title = "Section library",
  subtitle = "Browse every CMS section type by category — live previews with sample content.",
  backHref = null,
  backLabel = "All categories",
}: SectionLibraryBannerProps) {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-brand/30 text-white dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-4 inline-flex text-sm font-semibold text-white/80 no-underline hover:text-white"
          >
            ← {backLabel}
          </Link>
        ) : null}
        <p className="m-0 text-xs font-semibold uppercase tracking-widest text-brand-light">
          SkillHub CMS
        </p>
        <h1 className="mt-2 mb-0 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 mb-0 max-w-2xl text-base text-white/85 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cms/pages-content-sections"
            className="inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline hover:bg-slate-100"
          >
            Manage sections
          </Link>
          <Link
            href="/cms/pages-content-sections"
            className="inline-flex rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-white/10"
          >
            Section admin
          </Link>
        </div>
      </div>
    </div>
  );
}
