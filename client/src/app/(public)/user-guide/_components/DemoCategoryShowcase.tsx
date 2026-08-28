"use client";

import Link from "next/link";
import SectionWrapper from "@/components/sections/SectionWrapper";
import DemoSectionPreview from "./DemoSectionPreview";

export type DemoCategoryLink = {
  key: string;
  name: string;
};

export type DemoSectionMeta = {
  key: string;
  name: string;
  tags?: string[];
  render_key?: string;
};

type DemoCategoryShowcaseProps = {
  categoryKey: string;
  categoryName: string;
  sections: DemoSectionMeta[];
  allCategories: DemoCategoryLink[];
};

export default function DemoCategoryShowcase({
  categoryKey,
  categoryName,
  sections,
  allCategories,
}: DemoCategoryShowcaseProps) {
  const categoryIndex = allCategories.findIndex((item) => item.key === categoryKey);
  const prevCategory =
    categoryIndex > 0 ? allCategories[categoryIndex - 1] : null;
  const nextCategory =
    categoryIndex < allCategories.length - 1
      ? allCategories[categoryIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-transparent">
      <SectionWrapper className="py-10 sm:py-14">
        <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          <Link href="/user-guide" className="hover:underline">
            Section library
          </Link>
          {" / "}
          {categoryName}
        </p>
        <h1 className="section-theme-heading mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {categoryName}
        </h1>
        <p className="section-theme-muted mt-4 mb-0 max-w-3xl text-base leading-relaxed">
          {sections.length} layout{sections.length === 1 ? "" : "s"} in this
          category. Each preview uses realistic SkillHub demo data via{" "}
          <code className="text-sm">*Static</code> components — the same blocks
          available in the CMS section picker.
        </p>

        <nav
          aria-label="Other categories"
          className="mt-8 flex flex-wrap gap-2"
        >
          {allCategories.map((item) => (
            <Link
              key={item.key}
              href={`/user-guide/${item.key}`}
              aria-current={item.key === categoryKey ? "page" : undefined}
              className={`section-ui-card rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                item.key === categoryKey
                  ? "border-brand/50 bg-brand/5 text-brand"
                  : "text-slate-600 hover:border-brand/40 hover:text-brand dark:text-slate-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </SectionWrapper>

      {sections.map((section) => (
        <article
          key={section.key}
          id={`demo-section-${section.key}`}
          className="border-t border-slate-200 dark:border-slate-800"
        >
          <SectionWrapper className="py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="section-theme-heading m-0 text-lg font-semibold">
                  {section.name}
                </h2>
                <p className="section-theme-muted m-0 mt-1 font-mono text-xs">
                  {section.key}
                  {section.render_key
                    ? ` → renders as ${section.render_key}`
                    : ""}
                </p>
              </div>
              {section.tags?.length ? (
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {section.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </SectionWrapper>

          <DemoSectionPreview sectionKey={section.key} name={section.name} />
        </article>
      ))}

      <SectionWrapper className="border-t border-slate-200 py-10 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link href="/user-guide" className="text-brand hover:underline">
            ← All categories
          </Link>
          <div className="flex flex-wrap gap-4">
            {prevCategory ? (
              <Link
                href={`/user-guide/${prevCategory.key}`}
                className="text-brand hover:underline"
              >
                ← {prevCategory.name}
              </Link>
            ) : null}
            {nextCategory ? (
              <Link
                href={`/user-guide/${nextCategory.key}`}
                className="text-brand hover:underline"
              >
                {nextCategory.name} →
              </Link>
            ) : null}
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
