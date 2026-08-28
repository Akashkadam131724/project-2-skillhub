import type { ReactNode } from "react";

export type ContactChannelUiItem = {
  id?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  href?: string;
};

export type ContactFormUiProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  body?: string;
  successNote?: string;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  bodySlot?: ReactNode;
  channelsSlot?: ReactNode;
  channels?: ContactChannelUiItem[];
  itemsBar?: ReactNode;
  preview?: boolean;
  id?: string;
  className?: string;
};

export type ContactFormSectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: {
    body?: string;
    success_message?: string;
    [key: string]: unknown;
  };
  items?: unknown[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};
