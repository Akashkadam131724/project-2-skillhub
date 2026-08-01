import { fetchIndustryBySlug } from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/pages/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/pages/ResolvedPageSections";

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

  try {
    const industryRes = await fetchIndustryBySlug(slug);
    industry = industryRes.data;
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
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="industry"
          entityId={industryId}
          pageContext={{
            entityType: "industry",
            entityId: industryId,
            entityName: industry.name,
            catalogTitle: `${industry.name} Courses`,
            catalogSubtitle: `Courses aligned to the ${industry.name} industry.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
