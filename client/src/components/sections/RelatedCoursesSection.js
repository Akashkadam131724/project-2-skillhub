"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchCatalog } from "@/lib/api";
import CourseCard from "@/components/catalog/CourseCard";
import { EmptyState } from "@/components/detail/DetailShell";
import SectionFrame from "./SectionFrame";
import { catalogBaseParamsFromContext } from "./CatalogSection";

const FEATURED_LIMIT = 6;

/**
 * Featured courses rail — loads a small set from the entity catalog context.
 */
export default function RelatedCoursesSection({
  section_title,
  sub_title,
  pageContext,
  ...frameProps
}) {
  const baseParams = useMemo(
    () => catalogBaseParamsFromContext(pageContext),
    [pageContext]
  );

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(
    Boolean(Object.keys(baseParams).length)
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Object.keys(baseParams).length) {
      setCourses([]);
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchCatalog({
          ...baseParams,
          page: 1,
          limit: FEATURED_LIMIT,
        });
        if (!alive) return;
        setCourses(res.data || []);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load courses");
        setCourses([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [baseParams]);

  const title =
    (section_title && String(section_title).trim()) || "Featured courses";
  const subtitle =
    (sub_title && String(sub_title).trim()) ||
    "A quick look at popular training paths from this catalog.";

  return (
    <SectionFrame
      title={title}
      subtitle={subtitle}
      eyebrow="Courses"
      action={
        <Link
          href="#catalog"
          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink no-underline transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          View full catalog
        </Link>
      }
      buttonsFooter={false}
      {...frameProps}
    >
      {!Object.keys(baseParams).length ? (
        <EmptyState message="No catalog context available for featured courses." />
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-[1.35rem] bg-slate-200/70 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : error ? (
        <p className="m-0 text-sm text-rose-600">{error}</p>
      ) : courses.length === 0 ? (
        <EmptyState message="No featured courses to show yet." />
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <li key={String(course._id || course.id)}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </SectionFrame>
  );
}
