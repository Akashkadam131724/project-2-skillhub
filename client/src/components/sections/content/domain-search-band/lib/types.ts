export type DomainChipUiItem = {
  id: string;
  label: string;
};

export type DomainSearchBandSectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: { domain?: string };
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: () => void;
  id?: string;
};

export type DomainSearchBandUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  domain?: string;
  items?: DomainChipUiItem[];
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  itemsBar?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
};
