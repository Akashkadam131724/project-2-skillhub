import { Suspense } from "react";
import { fetchCourseBySlug } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import {
  cmsEditExitHref,
  cmsPublicHref,
} from "@/lib/cms-edit-routes";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Edit sections · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsCourseSectionEditPage({ params }) {
  const { slug } = await params;

  let course;
  let cmsSections = [];
  let pageTheme = null;

  try {
    const courseRes = await fetchCourseBySlug(slug);
    course = courseRes.data;
    const courseId = String(course._id || course.id);
    const sectionsRes = await getPageSectionsResolved("course", courseId).catch(
      () => ({ sections: [] })
    );
    cmsSections = sectionsRes.sections || [];
    pageTheme = sectionsRes.page?.theme || null;
  } catch {
    return <NotFoundState entity="Course" />;
  }

  const courseId = String(course._id || course.id);
  const product = course.product;
  const vendor = product?.vendor;
  const vendorLogo = vendor?.logoUrl || vendor?.vendorCatalogueLogo || null;
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
        { href: `/cms/course/${course.slug}`, label: course.name },
        { label: "Edit sections" },
      ]}
      title={course.name}
      subtitle={course.description}
      logo={vendorLogo}
      ctaHref={product?.slug ? `/product/${product.slug}` : "/courses"}
      ctaLabel={product?.slug ? "View product" : "Back to catalog"}
      flush
    >
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="course"
          entityId={courseId}
          entityLabel={course.name}
          initialSections={cmsSections}
          initialTheme={pageTheme}
          cmsMode
          publicHref={cmsPublicHref("course", course.slug)}
          exitHref={cmsEditExitHref("course", course.slug)}
          pageContext={{
            entityType: "course",
            entityId: courseId,
            entityName: course.name,
            productId,
            vendorId,
          }}
        />
      </Suspense>
    </DetailShell>
  );
}
