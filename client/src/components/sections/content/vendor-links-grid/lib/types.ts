import type { ReactNode } from "react";

export type VendorLinksGridLink = {
  id: string | number;
  label: string;
  href: string;
  iconUrl?: string;
  sortOrder?: number;
};

export type VendorLinksGridUiProps = {
  id?: string;
  title?: string;
  body?: string;
  links: VendorLinksGridLink[];
  titleSlot?: ReactNode;
  bodySlot?: ReactNode;
  linksSlot?: ReactNode;
  footer?: ReactNode;
  /** Dark band — gradient decor + inverted CTAs */
  onDarkBand?: boolean;
  className?: string;
};

export type VendorLinksGridSectionProps = {
  id?: string;
  section_key?: string;
  section_title?: string;
  sub_title?: string;
  data?: { body?: string };
  items?: unknown[];
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  section_theme?: string;
  sectionTheme?: string;
  surfaceTone?: string;
  surfaceBand?: { bg?: string; theme?: string } | string | null;
};
