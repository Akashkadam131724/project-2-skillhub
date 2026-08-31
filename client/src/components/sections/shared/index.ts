/**
 * Shared section building blocks (not CMS registry sections).
 *
 * - `design/` — layout surfaces (SectionBand, SectionLightCard, …)
 * - Card placeholders for CMS item previews
 */
export {
  SectionBand,
  SectionBrandGlow,
  SectionLightCard,
  SectionMediaOverlay,
} from "./design";
export { default as CardPlaceholder } from "./CardPlaceholder";
export {
  CmsSectionSubtitleSlot,
  CmsSectionTitleSlot,
  cmsSectionHeaderSlots,
} from "./CmsSectionHeaderSlots";
export type { CmsSectionHeaderSlotsOptions } from "./CmsSectionHeaderSlots";
export { cmsSectionChrome } from "./cms-section-chrome";
export type { CmsSectionChromeOptions } from "./cms-section-chrome";
export {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "./public-section-footer";
export type { PublicSectionButtonsFooterProps } from "./public-section-footer";
export { default as GenericItemPreviewCard } from "./GenericItemPreviewCard";
