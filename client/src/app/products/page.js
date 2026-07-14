import { fetchProducts } from "@/lib/api";
import EntityCatalog, {
  ProductCatalogCard,
} from "@/components/catalog/EntityCatalog";

export const metadata = {
  title: "Products",
  description: "Browse training products by vendor",
};

export default async function ProductsCatalogPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const q = params.q || "";

  let result = { data: [], total: 0, page: 1, totalPages: 1 };
  let error = "";

  try {
    result = await fetchProducts({
      page,
      limit: 24,
      q,
      status: "active",
      ...(params.vendor ? { vendor: params.vendor } : {}),
    });
  } catch (err) {
    error = err.message || "Failed to load products";
  }

  const products = result.data || [];

  return (
    <EntityCatalog
      crumbs={[{ label: "Products" }]}
      bannerTitle="Training Products & Learning Paths"
      bannerDescription="Browse product catalogs mapped to vendors — find the right learning track for your teams."
      catalogTitle="Product Catalog"
      catalogSubtitle="Explore training products and learning paths across vendors."
      searchPlaceholder="Search products"
      total={result.total || 0}
      totalLabel="Products"
      error={error}
      page={result.page || page}
      totalPages={result.totalPages || 1}
      emptyMessage="No products match your search."
    >
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={String(product._id || product.id)}>
            <ProductCatalogCard product={product} />
          </li>
        ))}
      </ul>
    </EntityCatalog>
  );
}
