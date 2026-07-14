import { fetchIndustries } from "@/lib/api";
import EntityCatalog, {
  TaxonomyCatalogCard,
} from "@/components/catalog/EntityCatalog";

export const metadata = {
  title: "Industries",
  description: "Browse industry solutions and related courses",
};

export default async function IndustriesCatalogPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const q = params.q || "";

  let result = { data: [], total: 0, page: 1, totalPages: 1 };
  let error = "";

  try {
    result = await fetchIndustries({
      page,
      limit: 50,
      q,
      status: "active",
    });
  } catch (err) {
    error = err.message || "Failed to load industries";
  }

  const industries = result.data || [];

  return (
    <EntityCatalog
      crumbs={[{ label: "Industries" }]}
      bannerTitle="Industry Solutions for Enterprise Teams"
      bannerDescription="Find training aligned to your sector — IT, healthcare, finance, government, retail, and more."
      catalogTitle="Industry Catalog"
      catalogSubtitle="Explore industry solutions and related training programs."
      searchPlaceholder="Search industries"
      total={result.total || 0}
      totalLabel="Industries"
      error={error}
      page={result.page || page}
      totalPages={result.totalPages || 1}
      emptyMessage="No industries match your search."
    >
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <li key={String(industry._id || industry.id)}>
            <TaxonomyCatalogCard
              item={industry}
              href={`/industries/${industry.slug}`}
              metaLabel="Browse courses for this industry"
            />
          </li>
        ))}
      </ul>
    </EntityCatalog>
  );
}
