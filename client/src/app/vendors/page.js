import { fetchVendors } from "@/lib/api";
import EntityCatalog, {
  VendorCatalogCard,
} from "@/components/catalog/EntityCatalog";

export const metadata = {
  title: "Vendors",
  description: "Browse training vendors and partners",
};

export default async function VendorsCatalogPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const q = params.q || "";

  let result = { data: [], total: 0, page: 1, totalPages: 1 };
  let error = "";

  try {
    result = await fetchVendors({ page, limit: 24, q, status: "active" });
  } catch (err) {
    error = err.message || "Failed to load vendors";
  }

  const vendors = result.data || [];

  return (
    <EntityCatalog
      crumbs={[{ label: "Vendors" }]}
      bannerTitle="Training Vendors & Technology Partners"
      bannerDescription="Explore enterprise vendors and partners — from cloud and security to business and specialty certifications."
      catalogTitle="Vendor Catalog"
      catalogSubtitle="Find technology partners and browse their training portfolios."
      searchPlaceholder="Search vendors"
      total={result.total || 0}
      totalLabel="Vendors"
      error={error}
      page={result.page || page}
      totalPages={result.totalPages || 1}
      emptyMessage="No vendors match your search."
    >
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
        {vendors.map((vendor) => (
          <li key={String(vendor._id || vendor.id)}>
            <VendorCatalogCard vendor={vendor} />
          </li>
        ))}
      </ul>
    </EntityCatalog>
  );
}
