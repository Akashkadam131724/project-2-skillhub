"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import { asBlogSummary } from "@/lib/types/blog";
import type { BlogSummary } from "@/lib/types/blog";
import CatalogPager from "../shared/CatalogPager";
import CatalogScrollAnchor from "../shared/CatalogScrollAnchor";
import CatalogSearch from "../shared/CatalogSearch";
import { fetchBlogs } from "@/lib/api";
import BlogDirectoryUi from "./BlogDirectoryUi";
import {
  resolveBlogDirectoryLimit,
  resolveBlogDirectorySubtitle,
  resolveBlogDirectoryTitle,
} from "./lib/resolve-header";
import type { BlogDirectorySectionProps } from "./lib/types";

export default function BlogDirectoryClient({
  section_title,
  sub_title,
  data,
  cmsMode = false,
  id,
  titleSlot,
  subtitleSlot,
}: BlogDirectorySectionProps & {
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const q = String(searchParams.get("q") || "").trim();
  const limit = resolveBlogDirectoryLimit(data);

  const [result, setResult] = useState<{
    data: BlogSummary[];
    total: number;
    page: number;
    totalPages: number;
  }>({
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
        const raw = response as {
          data?: unknown[];
          total?: number;
          page?: number;
          totalPages?: number;
        };
        setResult({
          data: (raw.data || [])
            .map(asBlogSummary)
            .filter((blog): blog is BlogSummary => blog !== null),
          total: raw.total ?? 0,
          page: raw.page ?? 1,
          totalPages: raw.totalPages ?? 1,
        });
        setError("");
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load articles");
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

  const title = resolveBlogDirectoryTitle(section_title);
  const subtitle = resolveBlogDirectorySubtitle(sub_title);

  const body = (
    <>
      <CatalogScrollAnchor className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-sm text-slate-500">
          {loading
            ? "Loading…"
            : `${(result.total || 0).toLocaleString("en-US")} ${
                result.total === 1 ? "article" : "articles"
              }`}
        </p>
        <Suspense
          fallback={
            <div className="h-12 w-full max-w-md animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          }
        >
          <CatalogSearch placeholder="Search insights…" />
        </Suspense>
      </CatalogScrollAnchor>

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
          <p className="m-0 text-lg font-semibold section-theme-heading">
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
          {showFeatured ? (
            <BlogCard blog={lead} featured />
          ) : null}
          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${showFeatured ? "mt-6" : ""}`}
          >
            {(showFeatured ? remaining : blogs).map((blog) => (
              <BlogCard
                key={blog._id || blog.id || blog.slug}
                blog={blog}
              />
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
    </>
  );

  return (
    <BlogDirectoryUi
      id={id}
      title={titleSlot ? undefined : title}
      subtitle={subtitleSlot ? undefined : subtitle || undefined}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
    >
      {body}
    </BlogDirectoryUi>
  );
}
