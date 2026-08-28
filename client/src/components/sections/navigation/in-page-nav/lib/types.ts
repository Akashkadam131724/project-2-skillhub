export type NavSectionRecord = {
  section_key?: string;
  in_page_nav_title?: string;
  section_title?: string;
  placement_id?: string | number;
  page_tag_id?: string | number;
  entity_override_id?: string | number;
  [key: string]: unknown;
};

export type InPageNavItem = {
  id: string;
  label: string;
  targetId: string;
};

export type InPageNavSectionProps = {
  navSections?: NavSectionRecord[];
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  id?: string;
};

export type InPageNavUiProps = {
  items: InPageNavItem[];
  preview?: boolean;
  id?: string;
};

export type InPageNavCmsPreviewProps = {
  sectionKey?: string;
};
