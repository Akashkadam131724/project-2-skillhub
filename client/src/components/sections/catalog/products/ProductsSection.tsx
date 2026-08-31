"use client";

import { catalogCmsSection } from "../shared/catalog-cms-section";
import ProductsClient from "./ProductsClient";
import type { ProductsSectionProps } from "./lib/types";

export default function ProductsSection({
  section_title,
  sub_title,
  pageContext,
  onEditField,
  id,
}: ProductsSectionProps) {
  return (
    <ProductsClient
      id={id}
      cmsMode
      section_title={section_title}
      sub_title={sub_title}
      pageContext={pageContext}
      onEditField={onEditField}
      {...catalogCmsSection({ section_title, sub_title, onEditField })}
    />
  );
}
