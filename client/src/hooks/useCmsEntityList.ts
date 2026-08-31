"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CmsEntityListItem, CmsListFilterId } from "@/components/cms/admin/types";
import { buildCmsListQuery } from "@/lib/cms/cms-list-filters";
import type { ApiListResponse, QueryParams } from "@/lib/api/types";

const EMPTY_EXTRA = Object.freeze({});

export type CmsListFetchFn<T extends CmsEntityListItem> = (
  params?: QueryParams
) => Promise<ApiListResponse>;

export type UseCmsEntityListOptions = {
  limit?: number;
  extraParams?: Record<string, unknown>;
};

/**
 * CMS entity list — server-side search, filter, and pagination.
 * Search is debounced via CmsListToolbar (useDebouncedSearch).
 */
export function useCmsEntityList<T extends CmsEntityListItem = CmsEntityListItem>(
  fetchFn: CmsListFetchFn<T>,
  options: UseCmsEntityListOptions = {}
) {
  const limit = options.limit ?? 20;
  const extraParams = options.extraParams ?? EMPTY_EXTRA;
  const extraRef = useRef(extraParams);
  extraRef.current = extraParams;

  const [q, setQ] = useState("");
  const [filter, setFilterRaw] = useState<CmsListFilterId>("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const onSearchChange = useCallback((value: string) => {
    setQ(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((value: CmsListFilterId) => {
    setFilterRaw(value);
    setPage(1);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFn(
        buildCmsListQuery({
          q,
          filter,
          page,
          limit,
          extra: extraRef.current,
        })
      );
      setItems((res.data || []) as T[]);
      setTotal(typeof res.total === "number" ? res.total : res.data?.length ?? 0);
      setTotalPages(Math.max(res.totalPages || 1, 1));
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, q, filter, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    filter,
    setFilter,
    page,
    setPage,
    limit,
    totalPages,
    items,
    total,
    loading,
    error,
    setError,
    onSearchChange,
    reload: load,
  };
}
