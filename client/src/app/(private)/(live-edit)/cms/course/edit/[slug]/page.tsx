import type { Metadata } from "next";
import { fetchCourseBySlug } from "@/lib/api";
import { fetchLiveEditPageTheme } from "@/lib/cms/live-edit-theme";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";
import { CmsLiveEditProvider } from "@/context/CmsLiveEditContext";
import type { SlugPageProps } from "@/app/types";

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Edit sections · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsCourseSectionEditPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let course: Record<string, unknown>;
  let pageTheme = null;

  try {
    const courseRes = await fetchCourseBySlug(slug);
    course = courseRes.data;
    pageTheme = await fetchLiveEditPageTheme("course");
  } catch {
    return <NotFoundState entity="Course" />;
  }

  const courseId = String(course._id || course.id);
  const product = course.product as Record<string, unknown> | undefined;
  const vendor = product?.vendor as Record<string, unknown> | undefined;
  const vendorLogo = (vendor?.logoUrl || vendor?.vendorCatalogueLogo || null) as string | null;
  const productId = product?._id || product?.id
    ? String(product._id || product.id)
    : null;
  const vendorId = vendor?._id || vendor?.id
    ? String(vendor._id || vendor.id)
    : null;

  return (
    <DetailShell
      crumbs={[
        { href: "/cms/courses", label: "CMS · Courses" },
        { href: `/cms/course/${course.slug}`, label: String(course.name) },
        { label: "Edit sections" },
      ]}
      title={String(course.name)}
      subtitle={course.description ? String(course.description) : undefined}
      logo={vendorLogo}
      ctaHref={product?.slug ? `/product/${product.slug}` : "/courses"}
      ctaLabel={product?.slug ? "View product" : "Back to catalog"}
      flush
    >
      <CmsLiveEditProvider
        pageKey="course"
        entityId={courseId}
        entityLabel={String(course.name)}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("course", String(course.slug))}
        pageContext={{
          entityType: "course",
          entityId: courseId,
          entityName: String(course.name),
          productId,
          vendorId,
        }}
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </DetailShell>
  );
}
