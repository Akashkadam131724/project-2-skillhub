"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blog/BlogCard";
import { SectionItemGrid } from "@/components/sections/layout";
import { DS_RADIUS, sectionClassNames } from "@/lib/sections/section-design-system";
import { asBlogSummary } from "@/lib/types/blog";
import type { BlogSummary } from "@/lib/types/blog";
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
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchBlogs({
      status: "active",
      limit,
      ...(category ? { category } : {}),
    })
      .then((response) => {
        if (alive) {
          setBlogs(
            ((response.data as unknown[]) || [])
              .map(asBlogSummary)
              .filter((blog): blog is BlogSummary => blog !== null)
          );
        }
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
    <div aria-label="Loading latest articles">
      <SectionItemGrid cols={3} peekOnMobile={false}>
        {[0, 1, 2].slice(0, limit).map((item) => (
          <div
            key={item}
            className={sectionClassNames(
              DS_RADIUS.media,
              "h-[25rem] animate-pulse bg-slate-200 dark:bg-slate-800"
            )}
          />
        ))}
      </SectionItemGrid>
    </div>
  ) : blogs.length ? (
    <SectionItemGrid cols={3} peekOnMobile={false}>
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id || blog.id || blog.slug}
          blog={blog}
        />
      ))}
    </SectionItemGrid>
  ) : (
    <div
      className={sectionClassNames(
        DS_RADIUS.empty,
        "border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700"
      )}
    >
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
