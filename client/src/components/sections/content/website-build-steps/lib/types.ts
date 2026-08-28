export type WebsiteBuildStepUiItem = {
  id: string;
  title?: string;
  subtitle?: string;
  body?: string;
  index: number;
};

export type WebsiteBuildStepsSectionProps = {
  section_title?: string;
  sub_title?: string;
  items?: unknown;
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
  id?: string;
};

export type WebsiteBuildStepsUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  items?: WebsiteBuildStepUiItem[];
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  itemsBar?: React.ReactNode;
  emptyState?: React.ReactNode;
  preview?: boolean;
};
