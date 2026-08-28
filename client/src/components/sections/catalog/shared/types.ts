import type { ReactNode } from "react";

export type CatalogLockedParams = Record<string, string | number | boolean | null | undefined>;

export type CatalogPagerProps = {
  page: number;
  totalPages: number;
  lockedParams?: CatalogLockedParams;
};

export type CatalogScrollAnchorProps = {
  children?: ReactNode;
  className?: string;
  id?: string;
};

export type CatalogSearchProps = {
  placeholder?: string;
  lockedParams?: CatalogLockedParams;
  scrollTargetId?: string;
};

export type CatalogFilterOption = {
  id?: string | number;
  slug?: string;
  label?: string;
  count?: number;
};

export type CatalogFilterGroup = {
  key: string;
  label: string;
  options?: CatalogFilterOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
  clearKeys?: string[];
  defaultOpen?: boolean;
};

export type CatalogFiltersProps = {
  groups?: CatalogFilterGroup[];
  lockedParams?: CatalogLockedParams;
  lockedKeys?: string[];
};

export type CourseCardRecord = {
  _id?: string | number;
  id?: string | number;
  name?: string;
  slug?: string;
  description?: string;
  product?: {
    name?: string;
    slug?: string;
    vendor?: { name?: string; slug?: string };
  };
  skillLevel?: { name?: string };
  industries?: Array<{ name?: string; slug?: string }>;
  skillingAreas?: Array<{ name?: string; slug?: string }>;
  [key: string]: unknown;
};

export type CourseCardProps = {
  course: CourseCardRecord;
};
