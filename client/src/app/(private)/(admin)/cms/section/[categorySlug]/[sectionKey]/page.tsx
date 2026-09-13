import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import { btnSecondary } from "@/components/cms/admin/CmsUi";
import { getStaticSectionShowcase } from "@/lib/sections/showcase";
import {
  SECTION_LIBRARY_INDEX_PATH,
  sectionCategoryHref,
} from "@/lib/sections/section-library";

type SectionPreviewPageProps = {
  params: Promise<{ categorySlug: string; sectionKey: string }>;
};

export async function generateMetadata({
  params,
}: SectionPreviewPageProps): Promise<Metadata> {
  const { categorySlug, sectionKey } = await params;
  const showcase = getStaticSectionShowcase(categorySlug, sectionKey);
  if (!showcase) {
    return { title: "Section library" };
  }
  return { title: `${showcase.name} · ${showcase.categoryTitle}` };
}

/**
 * Single section static preview — `/cms/section/{category}/{section}`.
 */
export default async function CmsSectionLibrarySectionPage({
  params,
}: SectionPreviewPageProps) {
  const { categorySlug, sectionKey } = await params;
  const showcase = getStaticSectionShowcase(categorySlug, sectionKey);

  if (!showcase?.sections?.length) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <Link
              href={SECTION_LIBRARY_INDEX_PATH}
              className="text-slate-500 no-underline hover:text-brand"
            >
              Section library
            </Link>
            {" / "}
            <Link
              href={sectionCategoryHref(showcase.categorySlug)}
              className="text-slate-500 no-underline hover:text-brand"
            >
              {showcase.categoryTitle}
            </Link>
            {" / "}
            {showcase.name}
          </p>
          <h1 className="m-0 mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            {showcase.name}
          </h1>
          <p className="m-0 mt-1 font-mono text-xs text-slate-400">
            {showcase.sectionKey}
          </p>
          <p className="m-0 mt-1 text-sm text-slate-600 dark:text-slate-400">
            Static preview with sample content — read only.
          </p>
        </div>
        <Link
          href={sectionCategoryHref(showcase.categorySlug)}
          className={btnSecondary}
        >
          Back to {showcase.categoryTitle}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <PublicPageSections
          pageKey="section"
          sections={showcase.sections}
          pageContext={{
            entityType: "section",
            sectionCategory: showcase.categoryKey,
            categorySlug: showcase.categorySlug,
          }}
        />
      </div>
    </div>
  );
}
