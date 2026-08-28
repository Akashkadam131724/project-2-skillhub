"use client";

import { Suspense } from "react";
import BlogDirectoryClient from "./BlogDirectoryClient";
import BlogDirectoryUi from "./BlogDirectoryUi";
import {
  resolveBlogDirectorySubtitle,
  resolveBlogDirectoryTitle,
} from "./lib/resolve-header";
import type { BlogDirectorySectionProps } from "./lib/types";

function BlogDirectoryFallback({
  section_title,
  sub_title,
  id,
}: BlogDirectorySectionProps) {
  return (
    <BlogDirectoryUi
      id={id}
      title={resolveBlogDirectoryTitle(section_title)}
      subtitle={resolveBlogDirectorySubtitle(sub_title) || undefined}
    >
      <div className="h-40 animate-pulse rounded-[1.25rem] bg-slate-200/60 dark:bg-slate-800" />
    </BlogDirectoryUi>
  );
}

export default function BlogDirectoryPublicSection(
  props: BlogDirectorySectionProps
) {
  return (
    <Suspense fallback={<BlogDirectoryFallback {...props} />}>
      <BlogDirectoryClient {...props} />
    </Suspense>
  );
}
