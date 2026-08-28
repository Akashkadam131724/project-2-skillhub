import type { ReactNode } from "react";
import type { CatalogPageContext } from "../../shared/lib/types";

export type CourseCatalogUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  baseParams?: Record<string, string>;
  hideFilterKeys?: string[];
  id?: string;
  className?: string;
};

export type CourseCatalogSectionProps = {
  section_title?: string;
  sub_title?: string;
  pageContext?: CatalogPageContext | null;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};

export type CourseCatalogClientProps = {
  baseParams?: Record<string, string>;
  hideFilterKeys?: string[];
  limit?: number;
  heading?: string;
};
