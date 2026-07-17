"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchBlogs } from "@/lib/api";
import BlogCard from "@/components/blog/BlogCard";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import CatalogPager from "@/components/catalog/CatalogPager";
import SectionFrame from "./SectionFrame";

function BlogDirectoryBody({
  section_title,
  sub_title,
  data,
  cmsMode,
  onEditField,
  frameProps,
}) {
  const searchParams = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const q = String(searchParams.get("q") || "").trim();
  const limit = Math.min(Math.max(Number(data?.limit) || 10, 1), 24);

  const [result, setResult] = useState({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetchBlogs({
      status: "active",
      page,
      limit,
      ...(q ? { q } : {}),
    })
      .then((response) => {
        if (!alive) return;
        setResult(response || { data: [], total: 0, page: 1, totalPages: 1 });
        setError("");
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || "Failed to load articles");
        setResult({ data: [], total: 0, page: 1, totalPages: 1 });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [limit, page, q]);

  const blogs = result.data || [];
  const [lead, ...remaining] = blogs;
  const showFeatured = page === 1 && !q && Boolean(lead);

  return (
    <SectionFrame
      id="blogs"
      title={section_title || "Latest thinking"}
      subtitle={sub_title || ""}
      eyebrow="SkillHub journal"
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttonsFooter={false}
      {...frameProps}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-sm text-slate-500">
          {loading
            ? "Loading…"
            : `${(result.total || 0).toLocaleString("en-US")} ${
                result.total === 1 ? "article" : "articles"
              }`}
        </p>
        <Suspense
          fallback={
            <div className="h-11 w-full max-w-md animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          }
        >
          <CatalogSearch placeholder="Search insights…" />
        </Suspense>
      </div>

      {error ? (
        <p className="m-0 mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[25rem] animate-pulse rounded-[1.75rem] bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : !error && !lead ? (
        <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <p className="m-0 text-lg font-semibold text-ink dark:text-white">
            No articles found
          </p>
          <p className="mt-2 mb-0 text-sm text-slate-500">
            {q
              ? "Try a broader search."
              : cmsMode
                ? "Publish blogs from the CMS to populate this directory."
                : "Published stories will appear here."}
          </p>
        </div>
      ) : (
        <>
          {showFeatured ? <BlogCard blog={lead} featured /> : null}
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${showFeatured ? "mt-6" : ""}`}>
            {(showFeatured ? remaining : blogs).map((blog) => (
              <BlogCard key={blog._id || blog.id || blog.slug} blog={blog} />
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Suspense fallback={null}>
          <CatalogPager
            page={result.page || page}
            totalPages={result.totalPages || 1}
          />
        </Suspense>
      </div>
    </SectionFrame>
  );
}

/** Full searchable blog journal for the Content `/blogs` listing page. */
export default function BlogDirectorySection({
  section_title,
  sub_title,
  data,
  cmsMode,
  onEditField,
  ...frameProps
}) {
  return (
    <Suspense
      fallback={
        <SectionFrame
          id="blogs"
          title={section_title || "Latest thinking"}
          subtitle={sub_title || ""}
          eyebrow="SkillHub journal"
          buttonsFooter={false}
          {...frameProps}
        >
          <div className="h-40 animate-pulse rounded-[1.25rem] bg-slate-200/60 dark:bg-slate-800" />
        </SectionFrame>
      }
    >
      <BlogDirectoryBody
        section_title={section_title}
        sub_title={sub_title}
        data={data}
        cmsMode={cmsMode}
        onEditField={onEditField}
        frameProps={frameProps}
      />
    </Suspense>
  );
}
