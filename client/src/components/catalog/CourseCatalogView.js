import { Suspense } from "react";
import { fetchCatalog, fetchCatalogFilters } from "@/lib/api";
import { mergeCatalogParams } from "@/lib/catalogParams";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import CourseCard from "@/components/catalog/CourseCard";
import CatalogPager from "@/components/catalog/CatalogPager";

function FiltersFallback() {
  return (
    <>
      <div className="mb-3 h-10 w-28 animate-pulse rounded-lg bg-slate-200 lg:hidden" />
      <aside className="hidden h-[520px] animate-pulse rounded-xl border border-slate-200 bg-white lg:block" />
    </>
  );
}

/**
 * Reusable course catalog grid + filters.
 * `baseParams` are always applied to fetches; matching filter groups are hidden.
 */
export default async function CourseCatalogView({
  searchParams = {},
  baseParams = {},
  hideFilterKeys,
  limit = 20,
  heading = "Courses",
  catalogTitle = "Course Catalog",
  catalogSubtitle,
}) {
  const lockedKeys =
    hideFilterKeys ||
    Object.keys(baseParams).filter(
      (key) =>
        baseParams[key] !== undefined &&
        baseParams[key] !== null &&
        baseParams[key] !== ""
    );

  const page = Math.max(Number(searchParams.page) || 1, 1);
  const merged = mergeCatalogParams(searchParams, baseParams);
  const catalogQuery = { ...merged, page, limit };
  const { page: _page, limit: _limit, ...filterQuery } = merged;

  let catalog = { data: [], total: 0, page: 1, totalPages: 1 };
  let filters = { groups: [] };
  let error = "";

  try {
    [catalog, filters] = await Promise.all([
      fetchCatalog(catalogQuery),
      fetchCatalogFilters(filterQuery),
    ]);
  } catch (err) {
    error = err.message || "Failed to load catalog";
  }

  const courses = catalog.data || [];
  const total = catalog.total || 0;
  const totalPages = catalog.totalPages || 1;
  const currentPage = catalog.page || page;

  const visibleGroups = (filters.groups || []).filter(
    (group) => !lockedKeys.includes(group.key)
  );
  const showFilters = visibleGroups.length > 0;

  return (
    <div id={catalogTitle ? "catalog" : undefined}>
      {catalogTitle && (
        <header className="mb-8 text-center sm:mb-10">
          <h2 className="m-0 text-[1.75rem] leading-tight font-bold tracking-tight text-ink sm:text-3xl dark:text-white">
            {catalogTitle}
          </h2>
          {catalogSubtitle && (
            <p className="mx-auto mt-3 mb-0 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
              {catalogSubtitle}
            </p>
          )}
        </header>
      )}

      <div
        className={
          showFilters
            ? "grid items-start gap-6 lg:grid-cols-[300px_1fr]"
            : "grid items-start gap-6"
        }
      >
        {showFilters && (
          <Suspense fallback={<FiltersFallback />}>
            <CatalogFilters
              groups={visibleGroups}
              lockedParams={baseParams}
              lockedKeys={lockedKeys}
            />
          </Suspense>
        )}

        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="m-0 text-xl font-bold text-ink dark:text-white">
              {error ? "—" : `${total.toLocaleString("en-US")} ${heading}`}
            </h3>
            <Suspense
              fallback={
                <div className="h-11 w-full max-w-md animate-pulse rounded-lg bg-slate-100" />
              }
            >
              <CatalogSearch
                placeholder="Search courses"
                lockedParams={baseParams}
              />
            </Suspense>
          </div>

          {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

          {!error && courses.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950">
              No courses match these filters.
            </p>
          )}

          <ul className="m-0 grid list-none gap-3 p-0">
            {courses.map((course) => (
              <li key={String(course._id || course.id)}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <Suspense fallback={null}>
              <CatalogPager
                page={currentPage}
                totalPages={totalPages}
                lockedParams={baseParams}
              />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}

