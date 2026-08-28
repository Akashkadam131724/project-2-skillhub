export type TemplateGalleryUiItem = {
  id: string;
  imageUrl?: string | null;
  category?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  large?: boolean;
};

export type TemplateGallerySectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  id?: string;
};

export type TemplateGalleryUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  items?: TemplateGalleryUiItem[];
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  itemsBar?: React.ReactNode;
  emptyState?: React.ReactNode;
  preview?: boolean;
};
