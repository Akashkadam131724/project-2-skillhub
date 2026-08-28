"use client";

import { Suspense } from "react";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import EntityDirectoryClient from "./EntityDirectoryClient";
import EntityDirectoryUi from "./EntityDirectoryUi";
import { DIRECTORY_META } from "./lib/directory-meta";
import {
  resolveDirectoryType,
  resolveEntityDirectoryTitle,
} from "./lib/resolve-directory";
import type { EntityDirectorySectionProps } from "./lib/types";

function EntityDirectoryFallback({
  section_title,
  sub_title,
  section_key = "entity_directory",
  data,
  pageContext,
  id,
}: EntityDirectorySectionProps) {
  const type = resolveDirectoryType(section_key, data, pageContext);
  const meta = DIRECTORY_META[type] || DIRECTORY_META.vendor;
  const title = resolveEntityDirectoryTitle(section_title, meta.label);

  return (
    <EntityDirectoryUi
      id={id}
      title={title}
      subtitle={sub_title || undefined}
      eyebrow={meta.label}
    >
      <div className="h-40 animate-pulse rounded-[1.25rem] bg-slate-200/60 dark:bg-slate-800" />
    </EntityDirectoryUi>
  );
}

export default function EntityDirectorySection({
  section_title,
  sub_title,
  section_key = "entity_directory",
  data,
  pageContext,
  onEditField,
  id,
}: EntityDirectorySectionProps) {
  return (
    <Suspense
      fallback={
        <EntityDirectoryFallback
          id={id}
          section_title={section_title}
          sub_title={sub_title}
          section_key={section_key}
          data={data}
          pageContext={pageContext}
        />
      }
    >
      <EntityDirectoryClient
        id={id}
        cmsMode
        section_title={section_title}
        sub_title={sub_title}
        section_key={section_key}
        data={data}
        pageContext={pageContext}
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
