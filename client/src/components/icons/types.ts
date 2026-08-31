import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export type StrokeIconProps = IconProps & {
  strokeWidth?: string | number;
};

export type MenuIconProps = IconProps & {
  open?: boolean;
};

export type ButtonIconProps = {
  kind?: string | null;
  className?: string;
};

export type ContactChannelIconProps = {
  kind?: "phone" | "location" | (string & {});
};

export type SuccessStoryTabIconProps = {
  name?: string | null;
};

export type SvgIconProps = IconProps & {
  children: ReactNode;
};
