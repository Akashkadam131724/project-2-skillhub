import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

export type ButtonSurface = "inherit" | "light" | "dark" | (string & {});

export type ButtonCustomStyle = {
  bg?: string;
  fg?: string;
  border?: string;
  hoverBg?: string;
  hoverFg?: string;
  hoverBorder?: string;
  background?: string;
  color?: string;
  text?: string;
  hoverBackground?: string;
  hoverColor?: string;
  hoverText?: string;
};

/** CMS / design-system button payload */
export type CmsButtonData = {
  _id?: string | number;
  id?: string | number;
  label?: string;
  variant?: string;
  size?: string;
  shape?: string;
  icon?: string;
  icon_position?: string;
  action_type?: string;
  target_url?: string;
  target_id?: string;
  form_key?: string;
  open_in_new_tab?: boolean | string | number;
  full_width?: boolean;
  aria_label?: string;
  download_filename?: string;
  sort_order?: number;
  status?: boolean;
  cls_bg?: string;
  cls_text?: string;
  cls_border?: string;
  cls_hover_bg?: string;
  cls_hover_text?: string;
  cls_hover_border?: string;
  [key: string]: unknown;
};

export type DsButtonProps = {
  button?: CmsButtonData;
  label?: string;
  variant?: string;
  size?: string;
  shape?: string;
  icon?: string;
  icon_position?: string;
  action_type?: string;
  target_url?: string;
  target_id?: string;
  form_key?: string;
  open_in_new_tab?: boolean | string | number;
  full_width?: boolean;
  aria_label?: string;
  download_filename?: string;
  className?: string;
  onFormOpen?: (formKey: string, button?: CmsButtonData) => void;
  inverted?: boolean;
  surface?: ButtonSurface;
  showIcon?: boolean;
  preview?: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  htmlType?: "button" | "submit";
  custom?: ButtonCustomStyle;
  style?: CSSProperties;
};

export type SectionButtonsProps = {
  buttons?: CmsButtonData[] | unknown[];
  button_title?: string;
  target_url?: string;
  className?: string;
  buttonClassName?: string;
  onFormOpen?: (formKey: string, button?: CmsButtonData) => void;
  inverted?: boolean;
  surface?: ButtonSurface;
};

export type DrawerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type DrawerSide = "left" | "right";
export type DrawerWidthPct = 50 | 70 | 75 | 100;

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  side?: DrawerSide;
  size?: DrawerSize;
  widthControl?: boolean;
  defaultWidthPct?: DrawerWidthPct;
};

export type HamburgerButtonProps = {
  onClick: () => void;
  label?: string;
  active?: boolean;
};

export type YoutubeModalProps = {
  open: boolean;
  title?: string;
  embedSrc?: string | null;
  watchHref?: string | null;
  onClose: () => void;
};
