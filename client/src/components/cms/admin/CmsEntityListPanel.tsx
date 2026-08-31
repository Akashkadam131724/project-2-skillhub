"use client";

import CmsListToolbar from "@/components/cms/admin/CmsListToolbar";
import CmsListPagination from "@/components/cms/admin/CmsListPagination";
import { CmsPanel, EmptyState } from "@/components/cms/admin/CmsUi";
import type { CmsEntityListItem, CmsEntityListPanelProps } from "./types";

/**
 * Shared CMS entity list panel — toolbar, rows, and server pagination.
 */
export default function CmsEntityListPanel<T extends CmsEntityListItem = CmsEntityListItem>({
  title,
  items,
  loading,
  total,
  page,
  totalPages,
  limit,
  onPageChange,
  onSearchChange,
  debounceMs,
  filter,
  onFilterChange,
  searchPlaceholder = "Search…",
  emptyMessage = "No items match this filter.",
  renderItem,
}: CmsEntityListPanelProps<T>) {
  const hasItems = items.length > 0;

  return (
    <CmsPanel title={title} className="w-full">
      <CmsListToolbar
        onSearchChange={onSearchChange}
        debounceMs={debounceMs}
        filter={filter}
        onFilterChange={onFilterChange}
        activeTotal={total}
        loading={loading}
        searchPlaceholder={searchPlaceholder}
      />

      {loading && !hasItems ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !hasItems ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          <ul
            className={`m-0 w-full list-none divide-y divide-slate-100 p-0 dark:divide-slate-900 ${
              loading ? "opacity-60" : ""
            }`}
          >
            {items.map((item) => renderItem(item))}
          </ul>
          <CmsListPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={onPageChange}
            loading={loading}
          />
        </>
      )}
    </CmsPanel>
  );
}
