"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildCmsListQuery } from "@/lib/cms/cms-list-filters";

const EMPTY_EXTRA = Object.freeze({});

/**
 * CMS entity list — server-side search, filter, and pagination.
 * Search is debounced via CmsListToolbar (useDebouncedSearch).
 */
export function useCmsEntityList(fetchFn, options = {}) {
  const limit = options.limit ?? 20;
  const extraParams = options.extraParams ?? EMPTY_EXTRA;
  const extraRef = useRef(extraParams);
  extraRef.current = extraParams;

  const [q, setQ] = useState("");
  const [filter, setFilterRaw] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSearchChange = useCallback((value) => {
    setQ(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((value) => {
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
      setItems(res.data || []);
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
