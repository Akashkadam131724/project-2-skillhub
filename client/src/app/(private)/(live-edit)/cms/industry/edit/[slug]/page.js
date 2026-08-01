import { Suspense } from "react";
import { fetchIndustryBySlug } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/api/cms-api";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Edit sections · ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function CmsIndustrySectionEditPage({ params }) {
  const { slug } = await params;

  let industry;
  let cmsSections = [];
  let pageTheme = null;

  try {
    const industryRes = await fetchIndustryBySlug(slug);
    industry = industryRes.data;
    const industryId = String(industry._id || industry.id);
    const sectionsRes = await getPageSectionsResolved(
      "industry",
      industryId
    ).catch(() => ({ sections: [] }));
    cmsSections = sectionsRes.sections || [];
    pageTheme = sectionsRes.page?.theme || null;
  } catch {
    return <NotFoundState entity="Industry" />;
  }

  const industryId = String(industry._id || industry.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/cms/industries", label: "CMS · Industries" },
        { href: `/cms/industry/${industry.slug}`, label: industry.name },
        { label: "Edit sections" },
      ]}
      title={industry.name}
      subtitle={industry.description}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="industry"
          entityId={industryId}
          entityLabel={industry.name}
          initialSections={cmsSections}
          initialTheme={pageTheme}
          cmsMode
          publicHref={cmsPublicHref("industry", industry.slug)}
          pageContext={{
            entityType: "industry",
            entityId: industryId,
            entityName: industry.name,
            catalogTitle: `${industry.name} Courses`,
            catalogSubtitle: `Courses aligned to the ${industry.name} industry.`,
          }}
        />
      </Suspense>
    </DetailShell>
  );
}
