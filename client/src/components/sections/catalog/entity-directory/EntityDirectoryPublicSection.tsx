"use client";

import { Suspense } from "react";
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

export default function EntityDirectoryPublicSection(
  props: EntityDirectorySectionProps
) {
  return (
    <Suspense fallback={<EntityDirectoryFallback {...props} />}>
      <EntityDirectoryClient {...props} />
    </Suspense>
  );
}
