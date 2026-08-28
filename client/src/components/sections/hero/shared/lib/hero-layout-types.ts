import type { ReactNode } from "react";
import type { HeroContentSectionProps } from "./types";

export type HeroLayoutUiProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  bodySlot?: ReactNode;
  imageSlot?: ReactNode;
  imageAddSlot?: ReactNode;
  footer?: ReactNode;
};

export type HeroLayoutSectionProps = HeroContentSectionProps;
