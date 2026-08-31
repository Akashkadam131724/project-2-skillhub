"use client";

import { useEffect, useMemo, useState } from "react";
import CourseCard from "../shared/CourseCard";
import DsButton from "@/components/ui/DsButton";
import { EmptyState } from "@/components/detail/DetailShell";
import { fetchCatalog } from "@/lib/api";
import { catalogBaseParamsFromContext } from "../shared/lib/context";
import { SectionItemGrid } from "@/components/sections/layout";
import {
  DS_RADIUS,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
import RelatedCoursesUi from "./RelatedCoursesUi";
import { RELATED_COURSES_FEATURED_LIMIT } from "./lib/constants";
import {
  resolveRelatedCoursesSubtitle,
  resolveRelatedCoursesTitle,
} from "./lib/resolve-header";
import { hasRelatedCoursesContext } from "./lib/placement";
import type { RelatedCoursesSectionProps } from "./lib/types";

export default function RelatedCoursesClient({
  section_title,
  sub_title,
  pageContext,
  cmsMode = false,
  id,
  titleSlot,
  subtitleSlot,
}: RelatedCoursesSectionProps & {
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
}) {
  const baseParams = useMemo(
    () => catalogBaseParamsFromContext(pageContext),
    [pageContext]
  );
  const hasContext = hasRelatedCoursesContext(pageContext);

  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(hasContext);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasContext) {
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
          limit: RELATED_COURSES_FEATURED_LIMIT,
        });
        if (!alive) return;
        setCourses((res.data || []) as Record<string, unknown>[]);
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load courses"
        );
        setCourses([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [baseParams, hasContext]);

  if (!cmsMode && !hasContext) return null;
  if (!cmsMode && !loading && !error && courses.length === 0) return null;

  const title = resolveRelatedCoursesTitle(section_title, pageContext);
  const subtitle = resolveRelatedCoursesSubtitle(sub_title);

  const action = (
    <DsButton
      label="View full catalog"
      variant="outline"
      size="md"
      shape="rounded"
      icon="none"
      action_type="anchor"
      target_id="catalog"
    />
  );

  let body: React.ReactNode;
  if (!hasContext) {
    body = (
      <EmptyState message="No catalog context available for featured courses." />
    );
  } else if (loading) {
    body = (
      <SectionItemGrid cols={2} peekOnMobile={false}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={sectionClassNames(
              DS_RADIUS.tile,
              "h-44 animate-pulse bg-slate-200/70 dark:bg-slate-800"
            )}
          />
        ))}
      </SectionItemGrid>
    );
  } else if (error) {
    body = <p className="m-0 text-sm text-rose-600">{error}</p>;
  } else if (courses.length === 0) {
    body = <EmptyState message="No featured courses to show yet." />;
  } else {
    body = (
      <SectionItemGrid cols={3} peekOnMobile={false}>
        {courses.map((course) => (
          <CourseCard key={String(course._id || course.id)} course={course} />
        ))}
      </SectionItemGrid>
    );
  }

  return (
    <RelatedCoursesUi
      id={id}
      title={titleSlot ? undefined : title}
      subtitle={subtitleSlot ? undefined : subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      action={action}
    >
      {body}
    </RelatedCoursesUi>
  );
}
