import type { ReactNode } from "react";

export type SarderEcosystemLogoItem = {
  id?: string;
  logo: string;
  alt: string;
  label: string;
  href?: string;
  disabled?: boolean;
  logoHeightClass?: string;
};

export type SarderEcosystemGroup = {
  id?: string;
  title: string;
  items: SarderEcosystemLogoItem[];
};

export type SarderEcosystemUiProps = {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  groups?: SarderEcosystemGroup[];
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  logoSlot?: ReactNode;
  groupsBar?: ReactNode;
  emptyGroupsState?: ReactNode;
};

export type SarderEcosystemSectionProps = {
  id?: string;
  section_key?: string;
  section_title?: string;
  sub_title?: string;
  section_img_url?: string;
  items?: unknown[];
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
};
