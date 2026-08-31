import type { ReactNode } from "react";

export type PageThemeDraft = Record<string, unknown>;

export type CmsThemeEditorMode = "site" | "page";
export type CmsThemeEditorInheritFrom = "site" | "template";
export type CmsOverrideGuideVariant =
  | "panel"
  | "compact"
  | "band"
  | "drawer-button";

export type PageThemeShellProps = {
  theme: PageThemeDraft;
  children: ReactNode;
  className?: string;
};

export type CmsThemeEditorProviderProps = {
  mode?: CmsThemeEditorMode;
  inheritFrom?: CmsThemeEditorInheritFrom;
  inheritedTheme?: PageThemeDraft | null;
  value?: PageThemeDraft;
  onChange?: (next: PageThemeDraft) => void;
  children: ReactNode;
};

export type CmsThemeEditorContextValue = {
  isPage: boolean;
  theme: PageThemeDraft;
  parent: PageThemeDraft;
  inheritNoun: string;
  inheritShort: string;
  setField: (key: string, next: unknown) => void;
  patchTheme: (patch: PageThemeDraft) => void;
  onChange?: (next: PageThemeDraft) => void;
  clearToInherit: () => void;
};

export type CmsThemeEditorShellProps = {
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
  hideGuide?: boolean;
};

export type CmsThemeEditorProps = {
  mode?: CmsThemeEditorMode;
  inheritFrom?: CmsThemeEditorInheritFrom;
  inheritedTheme?: PageThemeDraft | null;
  value?: PageThemeDraft;
  onChange?: (next: PageThemeDraft) => void;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
  hideGuide?: boolean;
};

export type SurfacePatternBand = {
  id?: string;
  label?: string;
  bg?: string;
  fg?: string;
};

export type SurfacePattern = {
  layout?: string;
  bands?: SurfacePatternBand[];
};

export type CmsSurfacePatternEditorProps = {
  value?: SurfacePattern | null;
  onChange?: (pattern: SurfacePattern) => void;
  inheritedTheme?: PageThemeDraft | null;
  isPage?: boolean;
  onInherit?: () => void;
};

export type QuickBandPreset = {
  label: string;
  bg: string;
};

export type BandRowProps = {
  band: SurfacePatternBand;
  index: number;
  total: number;
  onChange: (band: SurfacePatternBand) => void;
  onRemove: () => void;
  onMove: (from: number, to: number) => void;
};

export type QuickBandChipProps = {
  preset: QuickBandPreset;
  onClick: () => void;
};

export type CmsPageTemplateThemesPanelProps = {
  siteTheme: PageThemeDraft;
};

export type CmsOverrideGuideProps = {
  variant?: CmsOverrideGuideVariant;
};

export type CmsPageRow = {
  key: string;
  name?: string;
  entity_type?: string;
};
