import type { DragEvent, ReactNode } from "react";
import type { Editor } from "@tiptap/core";
import type { CmsButtonData } from "@/components/ui/types";

export type ButtonDraft = CmsButtonData & {
  _key?: string;
};

export type CmsButtonsEditorProps = {
  value?: ButtonDraft[];
  onChange: React.Dispatch<React.SetStateAction<ButtonDraft[]>>;
};

export type ButtonAppearanceFieldsProps = {
  value?: CmsButtonData;
  onChange?: (next: CmsButtonData) => void;
  onPatch?: (patch: Partial<CmsButtonData>) => void;
};

export type AppearanceSelectProps = {
  field: string;
  value?: string;
  onChange: (next: string) => void;
  group?: {
    field?: string;
    label?: string;
    hint?: string;
    suggestions?: Array<{ value: string; label: string }>;
  };
};

export type AppearancePreset = {
  id: string;
  label: string;
  description?: string;
  patch: Partial<CmsButtonData>;
};

export type PresetCardProps = {
  preset: AppearancePreset;
  active: boolean;
  onSelect: () => void;
};

export type ItemFieldOption = {
  value: string;
  label: string;
};

export type ItemFieldDef = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: ItemFieldOption[];
};

export type SectionItemDraft = {
  _key?: string;
  _id?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  label?: string;
  value?: string;
  image_url?: string;
  bg_color?: string;
  icon?: string;
  href?: string;
  item_type?: string;
  parent_id?: string;
  buttons?: ButtonDraft[];
  sort_order?: number;
  status?: boolean;
  [key: string]: unknown;
};

export type CmsItemsEditorProps = {
  value?: SectionItemDraft[];
  onChange: React.Dispatch<React.SetStateAction<SectionItemDraft[]>>;
  sectionKey?: string;
  renderKey?: string;
  expandItemButtons?: boolean;
  errorsByKey?: Record<string, Record<string, string>> | null;
};

export type ItemFieldControlProps = {
  field: ItemFieldDef;
  item: SectionItemDraft;
  itemKey: string | number;
  error?: string;
  onChange: (patch: Partial<SectionItemDraft>) => void;
  onButtonsChange: React.Dispatch<React.SetStateAction<ButtonDraft[]>>;
  buttonsOpen?: boolean;
  onToggleButtons: () => void;
};

export type CmsItemPreviewProps = {
  preview?: string;
  item: SectionItemDraft;
  index?: number;
};

export type CmsRichTextEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
};

export type ExitChipProps = {
  label: string;
  onExit: () => void;
  title?: string;
};

export type ListArmed = "bullet" | "ordered" | null;

export type ColorRange = { from: number; to: number } | null;

export type CmsBgColorPickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  variant?: "theme" | "banner" | "band";
  defaultLabel?: string;
  toneFilter?: "light" | "dark" | null;
};

export type BgPreset = {
  label: string;
  value: string;
};

export type PresetSolidRowProps = {
  presets: BgPreset[];
  current: string;
  onChange?: (value: string) => void;
};

export type PresetGradientGridProps = {
  presets: BgPreset[];
  current: string;
  onChange?: (value: string) => void;
};

export type ToneSectionProps = {
  title: string;
  hint?: string;
  solids: BgPreset[];
  gradients: BgPreset[];
  current: string;
  onChange?: (value: string) => void;
};

export type BandSurfacePreset = {
  id: string;
  label: string;
  hint?: string;
  bg?: string;
};

export type BandSurfaceGroup = {
  id?: string;
  title?: string;
  description?: string;
  tone?: string;
  presets: BandSurfacePreset[];
};

export type CmsBandSurfacePickerProps = {
  bgColor?: string;
  onSelect?: (preset: BandSurfacePreset) => void;
  disabled?: boolean;
  tone?: string | null;
  role?: "all" | "alternate" | "best";
  compact?: boolean;
  /** @deprecated use tone + role */
  variant?: "primary" | "alternate" | null;
};

export type VideoEmbedAttrs = {
  src: string;
  provider: "youtube" | "vimeo" | "file" | string;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (attrs: VideoEmbedAttrs | string) => ReturnType;
    };
  }
}

export type ValidateItemsDraftResult = {
  ok: boolean;
  errorsByKey: Record<string, Record<string, string>>;
};

export type EditorLike = Editor | null;
