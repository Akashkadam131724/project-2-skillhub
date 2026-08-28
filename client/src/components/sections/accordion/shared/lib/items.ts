import { itemAnswer, itemQuestion } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";

/** Public-showable FAQ row — both question and answer required. */
export function isFaqItemShowable(item: unknown): boolean {
  if (!item || (item as { status?: boolean }).status === false) return false;
  const question = String(itemQuestion(item) || "").trim();
  if (!question) return false;
  return !isRichTextEmpty(itemAnswer(item));
}
