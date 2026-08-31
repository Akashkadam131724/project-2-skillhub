import type { Metadata } from "next";
import { fetchCourseBySlug } from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/pages/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/pages/ResolvedPageSections";
import type { SlugPageProps } from "@/app/types";

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchCourseBySlug(slug);
    return {
      title: String(data.name || ""),
      description: String(data.description || data.name || ""),
    };
  } catch {
    return { title: "Course not found" };
  }
}

export default async function CourseDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let course: Record<string, unknown>;

  try {
    const courseRes = await fetchCourseBySlug(slug);
    course = courseRes.data;
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
        { href: "/courses", label: "Courses" },
        ...(vendor?.slug
          ? [{ href: `/vendor/${vendor.slug}`, label: String(vendor.name) }]
          : []),
        ...(product?.slug
          ? [{ href: `/product/${product.slug}`, label: String(product.name) }]
          : []),
        { label: String(course.name) },
      ]}
      title={String(course.name)}
      subtitle={course.description ? String(course.description) : undefined}
      logo={vendorLogo}
      ctaHref={product?.slug ? `/product/${product.slug}` : "/courses"}
      ctaLabel={product?.slug ? "View product" : "Back to catalog"}
      flush
    >
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="course"
          entityId={courseId}
          pageContext={{
            entityType: "course",
            entityId: courseId,
            entityName: String(course.name),
            productId,
            vendorId,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
