export type HeroData = {
  body?: string;
  eyebrow?: string;
  label?: string;
  image_url?: string;
};

export type HeroContentSectionProps = {
  section_title?: string;
  sub_title?: string;
  data?: HeroData;
  section_img_url?: string;
  items?: unknown[];
  section_key?: string;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  surfaceTone?: unknown;
  surfaceBand?: unknown;
  id?: string;
};
