import type { ReactNode } from "react";
import type { CatalogPageContext } from "../../shared/lib/types";

export type RelatedCoursesUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
};

export type RelatedCoursesSectionProps = {
  section_title?: string;
  sub_title?: string;
  pageContext?: CatalogPageContext | null;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
