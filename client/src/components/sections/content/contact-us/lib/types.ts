import type { ContactChannelUiItem } from "../../contact-form/lib/types";

export type { ContactChannelUiItem };

export type ContactUsSectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: { body?: string };
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

export type ContactUsUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string;
  items?: ContactChannelUiItem[];
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  bodySlot?: React.ReactNode;
  itemsSlot?: React.ReactNode;
  footer?: React.ReactNode;
};
