import { fetchIndustryBySlug } from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/ResolvedPageSections";
import { isrFetchOptions } from "@/lib/isr";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await fetchIndustryBySlug(
      slug,
      isrFetchOptions({ tags: ["industry", `industry:${slug}`] })
    );
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
    const industryRes = await fetchIndustryBySlug(
      slug,
      isrFetchOptions({ tags: ["industry", `industry:${slug}`] })
    );
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
          cacheTags={[`industry:${slug}`]}
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
