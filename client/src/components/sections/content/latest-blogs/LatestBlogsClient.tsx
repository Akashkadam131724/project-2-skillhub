"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blog/BlogCard";
import { fetchBlogs } from "@/lib/api";
import LatestBlogsUi from "./LatestBlogsUi";
import {
  resolveLatestBlogsCategory,
  resolveLatestBlogsLimit,
  resolveLatestBlogsSubtitle,
  resolveLatestBlogsTitle,
} from "./lib/resolve-header";
import type { LatestBlogsSectionProps } from "./lib/types";

export default function LatestBlogsClient({
  section_title,
  sub_title,
  data,
  cmsMode = false,
  id,
  titleSlot,
  subtitleSlot,
}: LatestBlogsSectionProps & {
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
}) {
  const limit = resolveLatestBlogsLimit(data);
  const category = resolveLatestBlogsCategory(data);
  const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchBlogs({
      status: "active",
      limit,
      ...(category ? { category } : {}),
    })
      .then((response) => {
        if (alive) setBlogs(response.data || []);
      })
      .catch(() => {
        if (alive) setBlogs([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [category, limit]);

  if (!loading && !blogs.length && !cmsMode) return null;

  const body = loading ? (
    <div className="grid gap-6 md:grid-cols-3" aria-label="Loading latest articles">
      {[0, 1, 2].slice(0, limit).map((item) => (
        <div
          key={item}
          className="h-[25rem] animate-pulse rounded-[1.75rem] bg-slate-200 dark:bg-slate-800"
        />
      ))}
    </div>
  ) : blogs.length ? (
    <div className="grid gap-6 md:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard
          key={String(blog._id || blog.id || blog.slug)}
          blog={blog}
        />
      ))}
    </div>
  ) : (
    <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
      <p className="section-theme-heading m-0 text-sm font-semibold">
        No published blogs yet
      </p>
      <p className="mt-1 mb-0 text-xs text-slate-500">
        Publish a blog from the CMS to populate this section.
      </p>
    </div>
  );

  return (
    <LatestBlogsUi
      id={id}
      title={titleSlot ? undefined : resolveLatestBlogsTitle(section_title)}
      subtitle={
        titleSlot
          ? undefined
          : resolveLatestBlogsSubtitle(sub_title) || undefined
      }
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
    >
      {body}
    </LatestBlogsUi>
  );
}
