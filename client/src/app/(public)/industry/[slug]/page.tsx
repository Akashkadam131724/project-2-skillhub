import type { Metadata } from "next";
import { fetchIndustryBySlug } from "@/lib/api";
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
    const { data } = await fetchIndustryBySlug(slug);
    return {
      title: String(data.name || ""),
      description: String(data.description || data.name || ""),
    };
  } catch {
    return { title: "Industry not found" };
  }
}

export default async function IndustryDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let industry: Record<string, unknown>;

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
        { label: String(industry.name) },
      ]}
      title={String(industry.name)}
      subtitle={industry.description ? String(industry.description) : undefined}
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
            entityName: String(industry.name),
            catalogTitle: `${industry.name} Courses`,
            catalogSubtitle: `Courses aligned to the ${industry.name} industry.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
