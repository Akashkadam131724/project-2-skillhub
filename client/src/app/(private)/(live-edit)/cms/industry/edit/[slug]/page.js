import { fetchIndustryBySlug } from "@/lib/api";
import { fetchLiveEditPageTheme } from "@/lib/cms/live-edit-theme";
import { cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";
import { CmsLiveEditProvider } from "@/components/cms/pages/live/CmsLiveEditContext";

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
  let pageTheme = null;

  try {
    const industryRes = await fetchIndustryBySlug(slug);
    industry = industryRes.data;
    pageTheme = await fetchLiveEditPageTheme("industry");
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
      <CmsLiveEditProvider
        pageKey="industry"
        entityId={industryId}
        entityLabel={industry.name}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("industry", industry.slug)}
        pageContext={{
          entityType: "industry",
          entityId: industryId,
          entityName: industry.name,
          catalogTitle: `${industry.name} Courses`,
          catalogSubtitle: `Courses aligned to the ${industry.name} industry.`,
        }}
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </DetailShell>
  );
}
