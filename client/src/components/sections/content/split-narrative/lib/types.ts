export type SplitNarrativeChapterUiItem = {
  id: string;
  imageUrl?: string | null;
  label?: string;
  title?: string;
  subtitle?: string;
  body?: string;
};

export type SplitNarrativeSectionProps = {
  section_title?: string;
  sub_title?: string;
  section_img_url?: string;
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  id?: string;
};

export type SplitNarrativeUiProps = {
  id?: string;
  coverImageUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  items?: SplitNarrativeChapterUiItem[];
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  itemsBar?: React.ReactNode;
  emptyState?: React.ReactNode;
  preview?: boolean;
};
