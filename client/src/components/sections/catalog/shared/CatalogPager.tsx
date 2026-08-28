"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { applyLockedParams } from "@/lib/api/catalogParams";
import { scrollToCatalogAnchor } from "@/lib/catalog/scrollAnchor";
import type { CatalogPagerProps } from "./types";

export default function CatalogPager({
  page,
  totalPages,
  lockedParams = {},
}: CatalogPagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function hrefFor(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    applyLockedParams(params, lockedParams);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function goToPage(nextPage: number, e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const href = hrefFor(nextPage);
    startTransition(() => {
      router.push(href, { scroll: false });
      requestAnimationFrame(() => scrollToCatalogAnchor());
    });
  }

  const baseClass =
    "rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm text-white no-underline";
  const disabledClass = `${baseClass} pointer-events-none opacity-40`;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950 ${isPending ? "opacity-70" : ""}`}
    >
      {page > 1 ? (
        <a
          href={hrefFor(page - 1)}
          onClick={(e) => goToPage(page - 1, e)}
          className={baseClass}
        >
          Previous
        </a>
      ) : (
        <span className={disabledClass}>Previous</span>
      )}

      <span className="text-sm text-slate-600 dark:text-slate-300">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <a
          href={hrefFor(page + 1)}
          onClick={(e) => goToPage(page + 1, e)}
          className={baseClass}
        >
          Next
        </a>
      ) : (
        <span className={disabledClass}>Next</span>
      )}
    </div>
  );
}
