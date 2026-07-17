import { Suspense } from "react";
import { fetchSkillingAreaBySlug } from "@/lib/api";
import { getPageSectionsResolved } from "@/lib/cms-api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await fetchSkillingAreaBySlug(slug);
    return {
      title: `${data.name}`,
      description: data.description || data.name,
    };
  } catch {
    return { title: "Skilling area not found" };
  }
}

export default async function SkillingAreaDetailPage({ params }) {
  const { slug } = await params;

  let area;
  let cmsSections = [];
  let pageTheme = null;

  try {
    const areaRes = await fetchSkillingAreaBySlug(slug);
    area = areaRes.data;
    const areaId = String(area._id || area.id);
    const sectionsRes = await getPageSectionsResolved(
      "skilling_area",
      areaId
    ).catch(() => ({ sections: [] }));
    cmsSections = sectionsRes.sections || [];
    pageTheme = sectionsRes.page?.theme || null;
  } catch {
    return <NotFoundState entity="Skilling area" />;
  }

  const areaId = String(area._id || area.id);

  return (
    <DetailShell
      crumbs={[
        { href: "/skilling-areas", label: "Skilling Areas" },
        { label: area.name },
      ]}
      title={area.name}
      subtitle={area.description}
      ctaHref="#catalog"
      ctaLabel="Browse courses"
      flush
    >
      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="skilling_area"
          entityId={areaId}
          entityLabel={area.name}
          initialSections={cmsSections}
          initialTheme={pageTheme}
          pageContext={{
            entityType: "skilling_area",
            entityId: areaId,
            entityName: area.name,
            catalogTitle: `${area.name} Courses`,
            catalogSubtitle: `Courses mapped to the ${area.name} skilling area.`,
          }}
        />
      </Suspense>
    </DetailShell>
  );
}
