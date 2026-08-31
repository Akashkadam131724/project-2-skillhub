/**
 * Button design system — single import for components and CMS.
 */
export {
  BUTTON_ACTION_LABELS,
  BUTTON_ACTION_TYPES,
  BUTTON_ICON_GROUPS,
  BUTTON_ICON_LABELS,
  BUTTON_ICON_POSITION_LABELS,
  BUTTON_ICON_POSITIONS,
  BUTTON_ICON_PRESETS,
  BUTTON_SHAPE_LABELS,
  BUTTON_SHAPES,
  BUTTON_SIZE_LABELS,
  BUTTON_SIZES,
  BUTTON_VARIANT_LABELS,
  BUTTON_VARIANTS,
  BUTTON_DARK_CTA_PRESETS,
  buttonAriaLabel,
  buttonAppearanceClasses,
  buttonDesignClasses,
  buttonVariantClass,
  buttonCustomStyle,
  buttonMergedStyle,
  BUTTON_CUSTOM_STYLE_KEYS,
  buttonSurfaceProps,
  buttonsFromLegacy,
  normalizeButton,
  parseYoutubeVideoId,
  resolveButtonAction,
  resolveButtonIcon,
  resolveButtonIconAuto,
  sortActiveButtons,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/utils/button-types";

export {
  BUTTON_ICON_GROUPS as BUTTON_ICON_CATALOG_GROUPS,
  buttonIconLabel,
  isButtonIconPreset,
} from "@/lib/ui/button-icon-catalog";

export {
  BUTTON_APPEARANCE_DEFAULT,
  BUTTON_APPEARANCE_FIELDS,
  BUTTON_APPEARANCE_FIELD_LABELS,
  BUTTON_APPEARANCE_PRESETS,
  BUTTON_CLASS_DARK_OUTLINE_PRESET,
  BUTTON_CLASS_SAFELIST,
  BUTTON_CLASS_SUGGESTION_GROUPS,
  BUTTON_CLASS_SOLID_WHITE_PRESET,
  BUTTON_HOVER_SUGGESTION_GROUPS,
  buttonAppearanceSummary,
} from "@/lib/ui/button-class-catalog";

export { default as DsButton } from "@/components/ui/DsButton";
export { default as SectionButtons } from "@/components/ui/SectionButtons";
