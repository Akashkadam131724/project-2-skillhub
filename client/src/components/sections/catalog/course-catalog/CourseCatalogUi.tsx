"use client";
import { SectionLayoutRoot } from "@/components/sections/layout";

import { Suspense } from "react";
import CourseCatalogClient from "./CourseCatalogClient";
import type { CourseCatalogUiProps } from "./lib/types";

export default function CourseCatalogUi({
  title,
  subtitle,
  eyebrow = "Catalog",
  titleSlot,
  subtitleSlot,
  baseParams = {},
  hideFilterKeys = [],
  id,
  className = "",
}: CourseCatalogUiProps) {

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-[0_24px_70px_-48px_color-mix(in_srgb,var(--ink)_35%,transparent)] sm:p-6">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-[1.25rem] bg-slate-200/60 dark:bg-slate-800" />
          }
        >
          <CourseCatalogClient
            baseParams={baseParams}
            hideFilterKeys={hideFilterKeys}
          />
        </Suspense>
      </div>
    </SectionLayoutRoot>
  );
}
