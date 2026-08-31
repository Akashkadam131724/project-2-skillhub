"use client";

import { Suspense } from "react";
import { catalogCmsSection } from "../shared/catalog-cms-section";
import {
  DS_RADIUS,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
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
      <div
        className={sectionClassNames(
          DS_RADIUS.accordion,
          "h-40 animate-pulse bg-slate-200/60 dark:bg-slate-800"
        )}
      />
    </BlogDirectoryUi>
  );
}

export default function BlogDirectorySection({
  section_title,
  sub_title,
  data,
  onEditField,
  id,
}: BlogDirectorySectionProps) {
  return (
    <Suspense
      fallback={
        <BlogDirectoryFallback
          id={id}
          section_title={section_title}
          sub_title={sub_title}
        />
      }
    >
      <BlogDirectoryClient
        id={id}
        cmsMode
        section_title={section_title}
        sub_title={sub_title}
        data={data}
        onEditField={onEditField}
        {...catalogCmsSection({ section_title, sub_title, onEditField })}
      />
    </Suspense>
  );
}
