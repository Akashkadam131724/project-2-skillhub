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
      <li key={String(product._id || product.id)}>
        <ProductCatalogCard product={product} />
      </li>
    ));
  }
  if (type === "industry") {
    return items.map((industry) => (
      <li key={String(industry._id || industry.id)}>
        <TaxonomyCatalogCard
          item={industry}
          href={`/industry/${industry.slug}`}
          metaLabel="Browse courses for this industry"
        />
      </li>
    ));
  }
  if (type === "skilling_area") {
    return items.map((area) => (
      <li key={String(area._id || area.id)}>
        <TaxonomyCatalogCard
          item={area}
          href={`/skilling-area/${area.slug}`}
          metaLabel="Browse courses in this skilling area"
        />
      </li>
    ));
  }
  return items.map((vendor) => (
    <li key={String(vendor._id || vendor.id)}>
      <VendorCatalogCard vendor={vendor} />
    </li>
  ));
}
