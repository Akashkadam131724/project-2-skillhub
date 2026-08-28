/**
 * Accordion category — shared across faq, faq_two_column, future variants.
 */
export { isFaqItemShowable } from "./items";
export { toFaqUiItems, resolveFaqUiItems, faqDarkBand } from "./map";
export {
  FAQ_SECTION_KEYS,
  isFaqPlacementShowable,
  isFaqSectionKey,
  faqPlacementProbe,
  validateFaqItem,
} from "./placement";
export type { FaqSectionKey } from "./placement";
export type {
  FaqUiItem,
  FaqSectionProps,
  AccordionUiBaseProps,
} from "./types";
