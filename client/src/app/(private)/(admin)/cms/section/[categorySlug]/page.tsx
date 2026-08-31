import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import { btnSecondary } from "@/components/cms/admin/CmsUi";
import {
  categorySlugFromKey,
  getStaticCategoryShowcase,
} from "@/lib/sections/showcase";
import { SECTION_LIBRARY_INDEX_PATH } from "@/lib/sections/section-library";
import type { CategorySlugPageProps } from "@/app/types";

export async function generateMetadata({
  params,
}: CategorySlugPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const showcase = getStaticCategoryShowcase(categorySlug);
  if (!showcase) {
    return { title: "Section library" };
  }
  return { title: `${showcase.title} · Section library` };
}

/**
 * Static section previews by category — no CMS content page or live edit.
 */
export default async function CmsSectionLibraryCategoryPage({
  params,
}: CategorySlugPageProps) {
  const { categorySlug } = await params;
  const showcase = getStaticCategoryShowcase(categorySlug);

  if (!showcase?.sections?.length) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Section library
          </p>
          <h1 className="m-0 mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            {showcase.title}
          </h1>
          <p className="m-0 mt-1 text-sm text-slate-600 dark:text-slate-400">
            Static previews with sample content — read only.
          </p>
        </div>
        <Link href={SECTION_LIBRARY_INDEX_PATH} className={btnSecondary}>
          All categories
        </Link>
      </div>

      <PublicPageSections
        pageKey="section"
        sections={showcase.sections}
        pageContext={{
          entityType: "section",
          sectionCategory: showcase.categoryKey,
          categorySlug: categorySlugFromKey(showcase.categoryKey),
        }}
      />
    </div>
  );
}
