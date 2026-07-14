"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { applyLockedParams } from "@/lib/catalogParams";

export default function CatalogPager({ page, totalPages, lockedParams = {} }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefFor(nextPage) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    applyLockedParams(params, lockedParams);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm text-white"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm text-white opacity-40">
          Previous
        </span>
      )}

      <span className="text-sm text-slate-600 dark:text-slate-300">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className="rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm text-white"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm text-white opacity-40">
          Next
        </span>
      )}
    </div>
  );
}
