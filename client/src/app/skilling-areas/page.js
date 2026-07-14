import { fetchSkillingAreas } from "@/lib/api";
import EntityCatalog, {
  TaxonomyCatalogCard,
} from "@/components/catalog/EntityCatalog";

export const metadata = {
  title: "Skilling Areas",
  description: "Browse skilling areas and related courses",
};

export default async function SkillingAreasCatalogPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const q = params.q || "";

  let result = { data: [], total: 0, page: 1, totalPages: 1 };
  let error = "";

  try {
    result = await fetchSkillingAreas({
      page,
      limit: 50,
      q,
      status: "active",
    });
  } catch (err) {
    error = err.message || "Failed to load skilling areas";
  }

  const areas = result.data || [];

  return (
    <EntityCatalog
      crumbs={[{ label: "Skilling Areas" }]}
      bannerTitle="Skilling Areas for Workforce Growth"
      bannerDescription="Explore capability domains — cloud, security, data, leadership, and more — mapped to role-based courses."
      catalogTitle="Skilling Area Catalog"
      catalogSubtitle="Browse capability domains and jump into related courses."
      searchPlaceholder="Search skilling areas"
      total={result.total || 0}
      totalLabel="Skilling Areas"
      error={error}
      page={result.page || page}
      totalPages={result.totalPages || 1}
      emptyMessage="No skilling areas match your search."
    >
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <li key={String(area._id || area.id)}>
            <TaxonomyCatalogCard
              item={area}
              href={`/skilling-areas/${area.slug}`}
              metaLabel="Browse courses in this skilling area"
            />
          </li>
        ))}
      </ul>
    </EntityCatalog>
  );
}
