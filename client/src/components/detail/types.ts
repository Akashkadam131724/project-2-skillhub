import type { ReactNode } from "react";

export type DetailBreadcrumb = {
  label: string;
  href?: string;
};

export type DetailShellProps = {
  crumbs?: DetailBreadcrumb[];
  title: string;
  subtitle?: string;
  logo?: string | null;
  badge?: string;
  ctaHref?: string;
  ctaLabel?: string;
  flush?: boolean;
  children?: ReactNode;
};

export type DetailSectionProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

export type EmptyStateProps = {
  message: string;
};

export type NotFoundStateProps = {
  entity?: string;
};
