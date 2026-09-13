import type { ReactNode } from "react";
import type { HeroLayoutSectionProps } from "@/components/sections/hero/shared/lib/hero-layout-types";

export type HeroStatsUiItem = {
  id?: string;
  value?: string;
  label?: string;
  title?: string;
};

export type HeroStatsUiProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  footer?: ReactNode;
  stats?: HeroStatsUiItem[];
  statsAddSlot?: ReactNode;
  itemsBar?: ReactNode;
  surfaceTone?: unknown;
  surfaceBand?: unknown;
};

export type HeroStatsSectionProps = HeroLayoutSectionProps;
