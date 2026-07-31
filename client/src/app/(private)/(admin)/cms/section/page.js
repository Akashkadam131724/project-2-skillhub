"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listSectionCategories } from "@/lib/cms-api";
import { sectionCategoryHref } from "@/lib/section-library";
import {
  CmsHeading,
  CmsPanel,
  ErrorBanner,
  EmptyState,
  btnSecondary,
} from "@/components/cms/CmsUi";

export default function CmsSectionLibraryIndexPage() {
  const [categories, setCategories] = useState([]);
  const [uncategorizedCount, setUncategorizedCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listSectionCategories({ status: true });
        if (!alive) return;
        setCategories(res.data || []);
        setUncategorizedCount(res.uncategorized_count || 0);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div>
      <CmsHeading
        title="Section library"
        subtitle="Live previews by category."
        actions={
          <Link href="/cms/pages-content-sections" className={btnSecondary}>
            All sections
          </Link>
        }
      />
      <ErrorBanner error={error} />

      <CmsPanel title="Categories">
        {!categories.length ? (
          <EmptyState message="No categories yet. Run npm run seed:section-categories on the server." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={sectionCategoryHref(cat.key)}
                className="rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-brand hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-brand"
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
        )}
      </CmsPanel>
    </div>
  );
}
