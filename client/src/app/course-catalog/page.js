import Link from "next/link";
import CourseCatalogView from "@/components/catalog/CourseCatalogView";
import PageBanner from "@/components/PageBanner";
import SectionWrapper from "@/components/sections/SectionWrapper";

export const metadata = {
  title: "Course Catalog",
  description: "Browse courses filtered by vendor and product",
};

export default async function CourseCatalogPage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      >
        <SectionWrapper className="flex flex-wrap items-center gap-2 py-3 text-sm text-slate-500">
          <Link href="/" className="no-underline hover:text-brand">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-300">Courses</span>
        </SectionWrapper>
      </nav>

      <PageBanner
        title="Enterprise-Grade Industry Solutions for Workforce Transformation"
        description="Browse role-based courses mapped to vendors, products, skilling areas, and industries — built for measurable workforce impact."
        ctaLabel="Explore Solutions"
        ctaHref="#catalog"
      />

      <SectionWrapper className="py-6 pb-16">
        <CourseCatalogView searchParams={params} catalogTitle="Course Catalog" />
      </SectionWrapper>
    </>
  );
}
