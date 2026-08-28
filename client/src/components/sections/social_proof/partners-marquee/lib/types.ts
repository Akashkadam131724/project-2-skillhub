import type { ReactNode } from "react";

export type PartnerLogoUiItem = {
  id?: string;
  name?: string;
  imageUrl?: string;
  href?: string;
};

export type PartnersMarqueeUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  eyebrowSlot?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  items?: PartnerLogoUiItem[];
  preview?: boolean;
  id?: string;
  className?: string;
};

export type PartnersMarqueeSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
