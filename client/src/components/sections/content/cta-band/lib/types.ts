export type CtaBandSectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: { body?: string };
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: () => void;
  id?: string;
};

export type CtaBandUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string;
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  bodySlot?: React.ReactNode;
  footer?: React.ReactNode;
};
