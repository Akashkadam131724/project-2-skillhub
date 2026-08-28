"use client";

import { Suspense } from "react";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
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
        titleSlot={
          <CmsEditable
            cmsMode
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title ? (
              <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                {section_title}
              </h2>
            ) : (
              <h2 className="section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl">
                Add title…
              </h2>
            )}
          </CmsEditable>
        }
        subtitleSlot={
          <CmsEditable
            cmsMode
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
          >
            {sub_title ? (
              <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                {sub_title}
              </p>
            ) : (
              <p className="section-theme-placeholder m-0 text-base leading-relaxed italic">
                Add subtitle…
              </p>
            )}
          </CmsEditable>
        }
      />
    </Suspense>
  );
}
