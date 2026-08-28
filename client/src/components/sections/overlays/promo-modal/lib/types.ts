import type { ReactNode } from "react";

export type PromoModalData = {
  body?: string;
  open_delay_ms?: number;
  storage_key?: string;
};

export type PromoModalConfig = {
  delayMs: number;
  storageKey: string;
  body: string;
};

export type PromoModalSectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: PromoModalData;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  id?: string;
};

export type PromoModalUiProps = {
  open: boolean;
  onDismiss: () => void;
  title?: string;
  subtitle?: string;
  body?: string;
  footer?: ReactNode;
  id?: string;
};

export type PromoModalCmsPreviewProps = {
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  delayMs: number;
  storageKey: string;
  footer?: ReactNode;
};
