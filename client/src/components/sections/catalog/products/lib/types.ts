import type { ReactNode } from "react";
import type { CatalogPageContext } from "../../shared/lib/types";

export type ProductsUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
};

export type ProductsSectionProps = {
  section_title?: string;
  sub_title?: string;
  pageContext?: CatalogPageContext | null;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};

export type ProductCardRecord = {
  _id?: string | number;
  id?: string | number;
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  [key: string]: unknown;
};

export type ProductCardProps = {
  product: ProductCardRecord;
  index?: number;
};
