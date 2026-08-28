"use client";

import ProductsClient from "./ProductsClient";
import { isProductsPlacementShowable } from "./lib/context";
import type { ProductsSectionProps } from "./lib/types";

export default function ProductsPublicSection(props: ProductsSectionProps) {
  if (!isProductsPlacementShowable(props, false)) return null;
  return <ProductsClient {...props} />;
}
