"use client";

import { btnSecondary } from "@/components/cms/admin/CmsUi";
import type { CmsListPaginationProps } from "./types";

export default function CmsListPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  loading = false,
}: CmsListPaginationProps) {
  if (!total || totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-900">
      <p className="m-0 text-xs text-slate-500">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`${btnSecondary} text-xs`}
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="text-xs text-slate-600 dark:text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={`${btnSecondary} text-xs`}
          disabled={loading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
