export type OverviewSectionProps = {
  id?: string;
  section_title?: string;
  sub_title?: string;
  data?: { body?: string };
  section_img_url?: string;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: () => void;
};

export type OverviewUiProps = {
  id?: string;
  className?: string;
  eyebrow?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  showImage?: boolean;
  title?: string | null;
  subtitle?: string | null;
  body?: string;
  imageSlot?: React.ReactNode;
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  bodySlot?: React.ReactNode;
  footer?: React.ReactNode;
};
