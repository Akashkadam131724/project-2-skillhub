import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchSectionLibraryShowcase } from "@/lib/api";
import SectionLibraryPageBody from "@/components/section-library/SectionLibraryPageBody";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  try {
    const res = await fetchSectionLibraryShowcase(categorySlug);
    const name = res.data?.showcase?.name || categorySlug;
    return { title: `${name} · Section library` };
  } catch {
    return { title: "Section library" };
  }
}

/**
 * Category showcase — section stack only (no extra banner or chrome).
 */
export default async function CmsSectionLibraryCategoryPage({ params }) {
  const { categorySlug } = await params;

  let showcase = null;
  try {
    const res = await fetchSectionLibraryShowcase(categorySlug);
    showcase = res.data || null;
  } catch {
    notFound();
  }

  if (!showcase?.sections?.length) {
    notFound();
  }

  const entityId = String(
    showcase.entity_id || showcase.showcase?.id || showcase.showcase?._id || ""
  );
  const title = showcase.showcase?.name || categorySlug;

  return (
    <Suspense fallback={null}>
      <SectionLibraryPageBody
        pageKey="section"
        entityId={entityId}
        entityLabel={title}
        initialSections={showcase.sections}
        initialTheme={showcase.page?.theme}
        pageContext={{
          entityType: "section",
          entityId,
          entityName: title,
          sectionCategory: categorySlug,
        }}
      />
    </Suspense>
  );
}
