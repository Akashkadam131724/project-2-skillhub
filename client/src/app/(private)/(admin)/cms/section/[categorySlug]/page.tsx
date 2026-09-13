import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { btnSecondary } from "@/components/cms/admin/CmsUi";
import { listCategoryLibrarySections } from "@/lib/sections/showcase";
import {
  SECTION_LIBRARY_INDEX_PATH,
  sectionLibrarySectionHref,
} from "@/lib/sections/section-library";
import type { CategorySlugPageProps } from "@/app/types";

export async function generateMetadata({
  params,
}: CategorySlugPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const catalog = listCategoryLibrarySections(categorySlug);
  if (!catalog) {
    return { title: "Section library" };
  }
  return { title: `${catalog.title} · Section library` };
}

/**
 * Category index — section cards linking to nested preview pages.
 */
export default async function CmsSectionLibraryCategoryPage({
  params,
}: CategorySlugPageProps) {
  const { categorySlug } = await params;
  const catalog = listCategoryLibrarySections(categorySlug);

  if (!catalog?.sections?.length) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <Link
              href={SECTION_LIBRARY_INDEX_PATH}
              className="text-slate-500 no-underline hover:text-brand"
            >
              Section library
            </Link>
            {" / "}
            {catalog.title}
          </p>
          <h1 className="m-0 mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            {catalog.title}
          </h1>
          <p className="m-0 mt-1 text-sm text-slate-600 dark:text-slate-400">
            {catalog.sections.length} section
            {catalog.sections.length === 1 ? "" : "s"} — open a card for a
            static preview.
          </p>
        </div>
        <Link href={SECTION_LIBRARY_INDEX_PATH} className={btnSecondary}>
          All categories
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.sections.map((section) => (
          <Link
            key={section.key}
            href={sectionLibrarySectionHref(catalog.categorySlug, section.key)}
            className="rounded-xl border border-slate-200 bg-white p-4 no-underline transition hover:border-brand hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-brand"
          >
            <p className="m-0 font-semibold text-slate-900 dark:text-white">
              {section.name}
            </p>
            <p className="mt-1 mb-0 font-mono text-xs text-slate-400">
              {section.key}
            </p>
            <p className="mt-3 mb-0 text-sm text-brand">View preview →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
