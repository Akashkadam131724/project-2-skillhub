import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

export type CmsListFilterId = "all" | "active" | "disabled" | "deleted" | (string & {});

export type CmsEntityListItem = {
  _id?: string;
  id?: string;
  status?: string;
  deletedAt?: string | null;
  slug?: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
};

export type CmsHeadingProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export type CmsPanelProps = {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export type StatusBadgeProps = {
  active?: boolean;
  labelOn?: string;
  labelOff?: string;
};

export type FieldProps = {
  label: string;
  children?: ReactNode;
  hint?: string;
  className?: string;
};

export type ErrorBannerProps = {
  error?: unknown;
};

export type EmptyStateProps = {
  message: string;
};

export type SectionPreviewThumbProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  rounded?: string;
  expandable?: boolean;
  fit?: "cover" | "contain";
  natural?: boolean;
};

export type CmsShellProps = {
  children?: ReactNode;
};

export type CmsMainLinksNewTabProps = {
  children?: ReactNode;
};

export type CmsListToolbarProps = {
  onSearchChange: (value: string) => void;
  debounceMs?: number;
  filter: CmsListFilterId;
  onFilterChange: (filterId: CmsListFilterId) => void;
  activeTotal?: number;
  loading?: boolean;
  searchPlaceholder?: string;
};

export type CmsListPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export type CmsEntityStatusBadgeProps = {
  item: CmsEntityListItem;
};

export type CmsEntityRowActionsProps = {
  item: CmsEntityListItem;
  editHref?: string;
  onEdit?: (item: CmsEntityListItem) => void;
  publicHref?: string;
  liveEditHref?: string;
  onToggleStatus?: (item: CmsEntityListItem) => void;
  onDelete?: (item: CmsEntityListItem) => void;
  onRestore?: (item: CmsEntityListItem) => void;
  canToggle?: boolean;
  canDelete?: boolean;
};

export type CmsEntityListPanelProps<T extends CmsEntityListItem = CmsEntityListItem> = {
  title?: string;
  items: T[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  debounceMs?: number;
  filter: CmsListFilterId;
  onFilterChange: (filterId: CmsListFilterId) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  renderItem: (item: T) => ReactNode;
};

export type CmsNavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export type CmsNavClickEvent = MouseEvent<HTMLElement>;

export type CmsNavKeyEvent = KeyboardEvent<HTMLElement>;
