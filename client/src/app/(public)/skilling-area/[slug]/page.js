import { fetchSkillingAreaBySlug } from "@/lib/api";
import {
  DetailShell,
  NotFoundState,
} from "@/components/detail/DetailShell";
import PublicPageSectionsSuspense from "@/components/cms/PublicPageSectionsSuspense";
import ResolvedPageSections from "@/components/cms/ResolvedPageSections";

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

  try {
    const areaRes = await fetchSkillingAreaBySlug(slug);
    area = areaRes.data;
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
      <PublicPageSectionsSuspense compact>
        <ResolvedPageSections
          pageKey="skilling_area"
          entityId={areaId}
          pageContext={{
            entityType: "skilling_area",
            entityId: areaId,
            entityName: area.name,
            catalogTitle: `${area.name} Courses`,
            catalogSubtitle: `Courses mapped to the ${area.name} skilling area.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
