"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchCatalog, fetchCatalogFilters } from "@/lib/api";
import { mergeCatalogParams, CATALOG_PAGE_SIZE } from "@/lib/api/catalogParams";
import CatalogFilters from "../shared/CatalogFilters";
import CatalogSearch from "../shared/CatalogSearch";
import CatalogScrollAnchor from "../shared/CatalogScrollAnchor";
import CourseCard from "../shared/CourseCard";
import CatalogPager from "../shared/CatalogPager";
import type { CatalogFilterGroup } from "../shared/types";
import type { CourseCardRecord } from "../shared/types";
import type { CourseCatalogClientProps } from "./lib/types";

type CatalogResult = {
  data: CourseCardRecord[];
  total: number;
  page: number;
  totalPages: number;
};

/** Client catalog body used by CatalogSection (CMS). */
export default function CourseCatalogClient({
  baseParams = {},
  hideFilterKeys,
  limit = CATALOG_PAGE_SIZE,
  heading = "Courses",
}: CourseCatalogClientProps) {
  const urlParams = useSearchParams();
  const searchParams = useMemo(() => {
    const out: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }, [urlParams]);

  const lockedKeys = useMemo(
    () =>
      hideFilterKeys ||
      Object.keys(baseParams).filter(
        (key) =>
          baseParams[key] !== undefined &&
          baseParams[key] !== null &&
          baseParams[key] !== ""
      ),
    [baseParams, hideFilterKeys]
  );

  const page = Math.max(Number(searchParams.page) || 1, 1);
  const merged = useMemo(
    () =>
      mergeCatalogParams(searchParams, baseParams) as Record<string, string>,
    [searchParams, baseParams]
  );

  const [catalog, setCatalog] = useState<CatalogResult>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<{ groups: CatalogFilterGroup[] }>({
    groups: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const catalogQuery = { ...merged, page, limit };
    const { page: _p, limit: _l, ...filterQuery } = merged;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const [catalogRes, filtersRes] = await Promise.all([
          fetchCatalog(catalogQuery),
          fetchCatalogFilters(filterQuery),
        ]);
        if (!alive) return;
        setCatalog(catalogRes as CatalogResult);
        const filterPayload = filtersRes as { groups?: CatalogFilterGroup[] };
        setFilters({ groups: filterPayload?.groups || [] });
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load catalog"
        );
        setCatalog({ data: [], total: 0, page: 1, totalPages: 1 });
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [merged, page, limit]);

  const courses = catalog.data || [];
  const total = catalog.total || 0;
  const totalPages = catalog.totalPages || 1;
  const currentPage = catalog.page || page;

  const visibleGroups = (filters.groups || []).filter(
    (group) => !lockedKeys.includes(group.key)
  );
  const showFilters = visibleGroups.length > 0;

  return (
    <div
      className={
        showFilters
          ? "grid items-start gap-6 lg:grid-cols-[300px_1fr]"
          : "grid items-start gap-6"
      }
    >
      {showFilters ? (
        <aside className="min-w-0">
          <CatalogFilters
            groups={visibleGroups}
            lockedParams={baseParams}
            lockedKeys={lockedKeys}
          />
        </aside>
      ) : null}

      <section className="min-w-0">
        <CatalogScrollAnchor className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-ink dark:text-white">
            {loading
              ? "…"
              : error
                ? "—"
                : `${total.toLocaleString("en-US")} ${heading}`}
          </h3>
          <CatalogSearch lockedParams={baseParams} />
        </CatalogScrollAnchor>

        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        {!error && !loading && courses.length === 0 ? (
          <p className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
            No courses match these filters.
          </p>
        ) : null}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-[1.35rem] bg-slate-200/70 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : (
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
            {courses.map((course) => (
              <li key={String(course._id || course.id)}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <CatalogPager
            page={currentPage}
            totalPages={totalPages}
            lockedParams={baseParams}
          />
        </div>
      </section>
    </div>
  );
}
