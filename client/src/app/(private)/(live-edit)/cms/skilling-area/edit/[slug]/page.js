import { fetchSkillingAreaBySlug } from "@/lib/api";
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

export default async function CmsSkillingAreaSectionEditPage({ params }) {
  const { slug } = await params;

  let area;
  let pageTheme = null;

  try {
    const areaRes = await fetchSkillingAreaBySlug(slug);
    area = areaRes.data;
    pageTheme = await fetchLiveEditPageTheme("skilling_area");
  } catch {
    return <NotFoundState entity="Skilling area" />;
  }

  const areaId = String(area._id || area.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/cms/skilling-areas", label: "CMS · Skilling areas" },
        { href: `/cms/skilling-area/${area.slug}`, label: area.name },
        { label: "Edit sections" },
      ]}
      title={area.name}
      subtitle={area.description}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <CmsLiveEditProvider
        pageKey="skilling_area"
        entityId={areaId}
        entityLabel={area.name}
        initialTheme={pageTheme}
        publicHref={cmsPublicHref("skilling_area", area.slug)}
        pageContext={{
          entityType: "skilling_area",
          entityId: areaId,
          entityName: area.name,
          catalogTitle: `${area.name} Courses`,
          catalogSubtitle: `Courses mapped to the ${area.name} skilling area.`,
        }}
      >
        <CmsLivePageSections />
      </CmsLiveEditProvider>
    </DetailShell>
  );
}
