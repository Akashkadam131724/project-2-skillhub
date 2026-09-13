import { Children, type ReactNode } from "react";

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
  /** Body slot from SectionLayoutRoot children (grids, clients, etc.) */
  children?: ReactNode;
  /** Extra body nodes counted toward `hasBody` (e.g. custom grids) */
  hasBodyContent?: boolean;
};

/** True when layout children should space the header like items/footer. */
export function hasRenderableSectionChildren(children?: ReactNode): boolean {
  if (children == null || typeof children === "boolean") return false;
  return Children.count(children) > 0;
}

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
  children,
  hasBodyContent = false,
}: SectionHeaderStateInput) {
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(
    showEyebrow || showTitle || showSubtitle || headerAction
  );
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasBody = Boolean(
    hasItems ||
      itemsBar ||
      emptyState ||
      footer ||
      hasBodyContent ||
      hasRenderableSectionChildren(children)
  );

  return {
    showEyebrow,
    showTitle,
    showSubtitle,
    showHeader,
    hasBody,
    hasItems,
  };
}
