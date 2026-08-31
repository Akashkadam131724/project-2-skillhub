import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import {
  DS_SPACE,
  sectionGridColsClass,
  sectionClassNames,
  type DsGridCols,
} from "@/lib/layout/section-layout-system";

export type SectionItemGridProps = {
  children?: ReactNode;
  cols?: DsGridCols;
  /** default | tight */
  gap?: "default" | "tight";
  /** Horizontal peek carousel on phones (default true) */
  peekOnMobile?: boolean;
  className?: string;
  listClassName?: string;
};

/**
 * Item / card grid with shared spacing — wraps MobileCardPeekRow presets.
 */
export default function SectionItemGrid({
  children,
  cols = 3,
  gap = "default",
  peekOnMobile = true,
  className = "",
  listClassName = "",
}: SectionItemGridProps) {
  const gapClassName =
    gap === "tight" ? DS_SPACE.gridGapTight : DS_SPACE.gridGap;
  const gridClassName = sectionGridColsClass(cols);

  if (!peekOnMobile) {
    return (
      <ul
        className={sectionClassNames(
          "m-0 grid list-none p-0",
          gapClassName,
          gridClassName,
          className,
          listClassName
        )}
      >
        {Children.map(children, (child, index) => {
          const key = isValidElement(child) ? child.key : null;
          return (
            <li key={key ?? index} className="min-w-0">
              {child}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <MobileCardPeekRow
      gapClassName={gapClassName}
      gridClassName={gridClassName}
      className={sectionClassNames(className, listClassName)}
    >
      {children}
    </MobileCardPeekRow>
  );
}
