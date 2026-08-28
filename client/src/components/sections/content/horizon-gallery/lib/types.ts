export type HorizonGalleryPanelUiItem = {
  id: string;
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type HorizonGallerySectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  id?: string;
};

export type HorizonGalleryUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  items?: HorizonGalleryPanelUiItem[];
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  itemsBar?: React.ReactNode;
  emptyState?: React.ReactNode;
  preview?: boolean;
};
