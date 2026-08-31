import type { ReactNode } from "react";

export type SectionHeaderStateInput = {
  eyebrow?: ReactNode;
  eyebrowSlot?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  titleSlot?: ReactNode;
  subtitleSlot?: ReactNode;
  headerAction?: ReactNode;
  itemsBar?: ReactNode;
  emptyState?: ReactNode;
  footer?: ReactNode;
  items?: unknown[];
  /** Extra body nodes counted toward `hasBody` (e.g. custom grids) */
  hasBodyContent?: boolean;
};

/** Shared visibility flags for standard band sections. */
export function sectionHeaderState({
  eyebrow,
  eyebrowSlot,
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  headerAction,
  itemsBar,
  emptyState,
  footer,
  items,
  hasBodyContent = false,
}: SectionHeaderStateInput) {
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(
    showEyebrow || showTitle || showSubtitle || headerAction
  );
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasBody = Boolean(hasItems || itemsBar || emptyState || footer || hasBodyContent);

  return {
    showEyebrow,
    showTitle,
    showSubtitle,
    showHeader,
    hasBody,
    hasItems,
  };
}
