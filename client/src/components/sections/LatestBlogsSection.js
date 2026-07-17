"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/lib/api";
import BlogCard from "@/components/blog/BlogCard";
import SectionFrame from "./SectionFrame";

export default function LatestBlogsSection({
  section_title,
  sub_title,
  data,
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const limit = Math.min(Math.max(Number(data?.limit) || 3, 1), 6);
  const category = String(data?.category || "").trim();
  const [blogs, setBlogs] = useState([]);
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

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="From the journal"
      cmsMode={cmsMode}
      onEditField={onEditField}
      action={
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink no-underline transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          View all insights <span aria-hidden>→</span>
        </Link>
      }
      {...frameProps}
    >
      {loading ? (
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
            <BlogCard key={blog._id || blog.id || blog.slug} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <p className="m-0 text-sm font-semibold text-ink dark:text-white">
            No published blogs yet
          </p>
          <p className="mt-1 mb-0 text-xs text-slate-500">
            Publish a blog from the CMS to populate this section.
          </p>
        </div>
      )}
    </SectionFrame>
  );
}
