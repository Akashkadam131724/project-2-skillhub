import {
  itemAnswer,
  itemQuestion,
  resolveItemsForSection,
} from "@/lib/sections/item-types";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import { isFaqItemShowable } from "./items";
import type { FaqUiItem } from "./types";

type MappingItem = {
  _id?: string;
  id?: string;
  buttons?: unknown[];
  [key: string]: unknown;
};

export function toFaqUiItems(mappingItems: MappingItem[]): FaqUiItem[] {
  return mappingItems.map((item, i) => ({
    id: String(item._id || item.id || i),
    question: itemQuestion(item),
    answer: itemAnswer(item),
    buttons: item.buttons,
  }));
}

export function resolveFaqUiItems(
  sectionKey: string,
  mappingItems: unknown,
  options: { cmsMode?: boolean } = {}
): FaqUiItem[] {
  const resolved = resolveItemsForSection(
    sectionKey,
    mappingItems
  ) as MappingItem[];
  const list = options.cmsMode
    ? resolved
    : resolved.filter(isFaqItemShowable);
  return toFaqUiItems(list);
}

export function faqDarkBand(props: {
  section_theme?: unknown;
  sectionTheme?: unknown;
  surfaceTone?: unknown;
  surfaceBand?: unknown;
}): boolean {
  return isPlacementDarkBand(props);
}
