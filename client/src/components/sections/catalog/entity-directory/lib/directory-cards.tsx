import {
  ProductCatalogCard,
  TaxonomyCatalogCard,
  VendorCatalogCard,
} from "./entity-catalog-cards";
import type { DirectoryType } from "./directory-meta";

export function DirectoryCards({
  type,
  items,
}: {
  type: DirectoryType;
  items: Record<string, unknown>[];
}) {
  if (type === "product") {
    return items.map((product) => (
      <ProductCatalogCard
        key={String(product._id || product.id)}
        product={product}
      />
    ));
  }
  if (type === "industry") {
    return items.map((industry) => (
      <TaxonomyCatalogCard
        key={String(industry._id || industry.id)}
        item={industry}
        href={`/industry/${industry.slug}`}
        metaLabel="Browse courses for this industry"
      />
    ));
  }
  if (type === "skilling_area") {
    return items.map((area) => (
      <TaxonomyCatalogCard
        key={String(area._id || area.id)}
        item={area}
        href={`/skilling-area/${area.slug}`}
        metaLabel="Browse courses in this skilling area"
      />
    ));
  }
  return items.map((vendor) => (
    <VendorCatalogCard
      key={String(vendor._id || vendor.id)}
      vendor={vendor}
    />
  ));
}
