import Link from "next/link";
import { sectionCategoryHref } from "@/lib/sections/section-library";

export default function SectionLibraryCategoryGrid({
  categories = [],
  uncategorizedCount = 0,
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="m-0 text-xl font-bold text-slate-900 dark:text-white">
        Categories
      </h2>
      <p className="mt-1 mb-6 text-sm text-slate-600 dark:text-slate-400">
        Open a category to scroll through every registered layout with sample
        content.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.key || cat.id}
            href={cat.href || sectionCategoryHref(cat.slug || cat.key)}
            className="rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-brand hover:shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <p className="m-0 font-semibold text-slate-900 dark:text-white">
              {cat.name}
            </p>
            <p className="mt-1 mb-0 font-mono text-xs text-slate-400">
              {cat.key}
            </p>
            <p className="mt-3 mb-0 text-sm text-slate-600 dark:text-slate-300">
              {cat.section_count ?? 0} section
              {(cat.section_count ?? 0) === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
        {uncategorizedCount > 0 ? (
          <Link
            href="/cms/pages-content-sections?category=uncategorized"
            className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 no-underline dark:border-slate-700 dark:bg-slate-900/50"
          >
            <p className="m-0 font-semibold text-slate-800 dark:text-slate-100">
              Uncategorized
            </p>
            <p className="mt-3 mb-0 text-sm text-slate-600 dark:text-slate-300">
              {uncategorizedCount} in admin
            </p>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
