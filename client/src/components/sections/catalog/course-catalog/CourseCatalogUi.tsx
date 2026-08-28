"use client";

import { Suspense } from "react";
import CourseCatalogClient from "./CourseCatalogClient";
import SectionWrapper from "@/components/sections/SectionWrapper";
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
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(eyebrow || showTitle || showSubtitle);

  return (
    <section
      id={id || "catalog"}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-2.5 sm:gap-3 ${
              "mb-8 sm:mb-10"
            }`}
          >
            {eyebrow ? (
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
            {titleSlot != null ? (
              titleSlot
            ) : showTitle ? (
              <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {subtitleSlot != null ? (
              subtitleSlot
            ) : showSubtitle ? (
              <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

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
      </SectionWrapper>
    </section>
  );
}
