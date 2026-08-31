"use client";

import { Suspense } from "react";
import { catalogCmsSection } from "../shared/catalog-cms-section";
import {
  DS_RADIUS,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
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
      <div
        className={sectionClassNames(
          DS_RADIUS.accordion,
          "h-40 animate-pulse bg-slate-200/60 dark:bg-slate-800"
        )}
      />
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
        {...catalogCmsSection({ section_title, sub_title, onEditField })}
      />
    </Suspense>
  );
}
