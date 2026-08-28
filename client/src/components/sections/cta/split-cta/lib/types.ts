import type { CSSProperties } from "react";

export type SplitCtaImageSide = "left" | "right";

export type SplitCtaSectionProps = {
  section_title?: string;
  sub_title?: string;
  section_img_url?: string;
  section_bg_color?: string;
  data?: {
    image_url?: string;
    image_side?: string;
    bg_color?: string;
  };
  section_key?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: () => void;
  id?: string;
};

export type SplitCtaUiProps = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  imageSide?: SplitCtaImageSide;
  bandStyle?: CSSProperties | null;
  useThemeBand?: boolean;
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
  footer?: React.ReactNode;
  imageSideControl?: React.ReactNode;
  preview?: boolean;
};
