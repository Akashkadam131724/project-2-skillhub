import type { ReactNode } from "react";
import type { CatalogPageContext } from "../../shared/lib/types";
import type { DirectoryMeta, DirectoryType } from "./directory-meta";

export type EntityDirectoryUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
};

export type EntityDirectorySectionProps = {
  section_title?: string;
  sub_title?: string;
  section_key?: string;
  data?: Record<string, unknown> | null;
  pageContext?: CatalogPageContext | null;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};

export type EntityDirectoryPanelProps = {
  type: DirectoryType;
  meta: DirectoryMeta;
  loading: boolean;
  error: string;
  total: number;
  items: Record<string, unknown>[];
  page: number;
  totalPages: number;
};
