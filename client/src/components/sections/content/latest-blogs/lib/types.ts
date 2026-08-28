export type LatestBlogsSectionProps = {
  id?: string;
  section_title?: string;
  sub_title?: string;
  data?: { limit?: number | string; category?: string };
  cmsMode?: boolean;
  onEditField?: (field: string) => void;
};

export type LatestBlogsUiProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
};
