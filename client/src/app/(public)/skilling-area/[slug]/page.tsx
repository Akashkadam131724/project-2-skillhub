import type { Metadata } from "next";
import { fetchSkillingAreaBySlug } from "@/lib/api";
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
    const { data } = await fetchSkillingAreaBySlug(slug);
    return {
      title: String(data.name || ""),
      description: String(data.description || data.name || ""),
    };
  } catch {
    return { title: "Skilling area not found" };
  }
}

export default async function SkillingAreaDetailPage({ params }: SlugPageProps) {
  const { slug } = await params;

  let area: Record<string, unknown>;

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
        { label: String(area.name) },
      ]}
      title={String(area.name)}
      subtitle={area.description ? String(area.description) : undefined}
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
            entityName: String(area.name),
            catalogTitle: `${area.name} Courses`,
            catalogSubtitle: `Courses mapped to the ${area.name} skilling area.`,
          }}
        />
      </PublicPageSectionsSuspense>
    </DetailShell>
  );
}
