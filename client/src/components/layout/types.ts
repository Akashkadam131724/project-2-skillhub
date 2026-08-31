import type { MouseEventHandler, ReactNode } from "react";

export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  crumbs?: BreadcrumbCrumb[];
};

export type PageBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  logo?: string | null;
};

export type SkillHubLogoProps = {
  showWordmark?: boolean;
  size?: number;
  className?: string;
  priority?: boolean;
};

export type HeaderNavMode = "api" | "static";

export type NavLinkItem = {
  _id?: string | number;
  name: string;
  url?: string;
  description?: string;
};

export type NavColumn = {
  _id?: string | number;
  name: string;
  navLinks?: NavLinkItem[];
};

export type NavigationItem = {
  _id?: string | number;
  name: string;
  columns?: NavColumn[];
};

export type ProjectNavProps = {
  showDesktop?: boolean;
  showMobile?: boolean;
};

export type SiteHeaderNavProps = {
  navigation: NavigationItem[];
  showDesktop?: boolean;
  showMobile?: boolean;
};

export type HeaderContactButtonProps = {
  className?: string;
  fullWidth?: boolean;
  onNavigate?: MouseEventHandler<HTMLElement>;
};

export type HeaderIconButtonProps = {
  href: string;
  label: string;
  children: ReactNode;
};

export type HeaderNavSlotProps = {
  mode: HeaderNavMode;
  navigation: NavigationItem[];
  showDesktop?: boolean;
  showMobile?: boolean;
};
