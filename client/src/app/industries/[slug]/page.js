import { Suspense } from "react";
import { fetchIndustryBySlug } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await fetchIndustryBySlug(slug);
    return {
      title: `${data.name}`,
      description: data.description || data.name,
    };
  } catch {
    return { title: "Industry not found" };
  }
}

export default async function IndustryDetailPage({ params }) {
  const { slug } = await params;

  let industry;
  let cmsSections = [];

  try {
    const industryRes = await fetchIndustryBySlug(slug);
    industry = industryRes.data;
    const industryId = String(industry._id || industry.id);
    const sectionsRes = await getPageSectionsResolved(
      "industry",
      industryId
    ).catch(() => ({ sections: [] }));
    cmsSections = sectionsRes.sections || [];
  } catch {
    return <NotFoundState entity="Industry" />;
  }

  const industryId = String(industry._id || industry.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/industries", label: "Industries" },
        { label: industry.name },
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
