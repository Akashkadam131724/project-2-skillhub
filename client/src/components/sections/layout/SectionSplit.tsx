import type { ReactNode } from "react";
import {
  DS_RAIL_COL,
  DS_RAIL_GRID,
  DS_SPLIT_GAP,
  sectionClassNames,
  type DsSplitGap,
} from "@/lib/layout/section-layout-system";

export type SectionSplitRatio =
  | "50-50"
  | "40-60"
  | "60-40"
  | "sidebar-380";

export type SectionSplitProps = {
  left?: ReactNode;
  right?: ReactNode;
  /**
   * flex — legacy width fractions
   * rail — 12-col grid inside SectionWrapper (aligns with layout ruler)
   * grid — fixed sidebar grid (e.g. sarder 380px)
   */
  variant?: "flex" | "rail" | "grid";
  ratio?: SectionSplitRatio;
  gap?: DsSplitGap;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
};

function flexRatioClasses(ratio: SectionSplitRatio) {
  switch (ratio) {
    case "40-60":
      return { left: "lg:w-2/5", right: "lg:w-3/5" };
    case "60-40":
      return { left: "lg:w-3/5", right: "lg:w-2/5" };
    case "50-50":
    default:
      return { left: "lg:w-1/2", right: "lg:w-1/2" };
  }
}

function railRatioClasses(ratio: SectionSplitRatio) {
  switch (ratio) {
    case "40-60":
      return { left: DS_RAIL_COL.copy40, right: DS_RAIL_COL.main60 };
    case "60-40":
      return { left: DS_RAIL_COL.copy60, right: DS_RAIL_COL.main40 };
    case "50-50":
    default:
      return { left: DS_RAIL_COL.copy50, right: DS_RAIL_COL.main50 };
  }
}

function gridRatioClasses(ratio: SectionSplitRatio) {
  if (ratio === "sidebar-380") {
    return "xl:grid-cols-[380px_1fr]";
  }
  if (ratio === "40-60") {
    return "lg:grid-cols-[2fr_3fr]";
  }
  if (ratio === "60-40") {
    return "lg:grid-cols-[3fr_2fr]";
  }
  return "lg:grid-cols-2";
}

/**
 * Two-column section body — copy left / cards right, etc.
 */
export default function SectionSplit({
  left,
  right,
  variant = "flex",
  ratio = "50-50",
  gap = "md",
  className = "",
  leftClassName = "",
  rightClassName = "",
}: SectionSplitProps) {
  if (left && !right) {
    return <div className={sectionClassNames("min-w-0", className)}>{left}</div>;
  }
  if (!left && right) {
    return <div className={sectionClassNames("min-w-0", className)}>{right}</div>;
  }
  if (!left && !right) return null;

  if (variant === "rail") {
    const cols = railRatioClasses(ratio);
    return (
      <div
        className={sectionClassNames(
          DS_RAIL_GRID.shell,
          DS_SPLIT_GAP[gap],
          className
        )}
      >
        <div className={sectionClassNames(cols.left, leftClassName)}>{left}</div>
        <div className={sectionClassNames(cols.right, rightClassName)}>
          {right}
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div
        className={sectionClassNames(
          "grid w-full grid-cols-1",
          DS_SPLIT_GAP[gap],
          gridRatioClasses(ratio),
          className
        )}
      >
        <div className={leftClassName}>{left}</div>
        <div className={rightClassName}>{right}</div>
      </div>
    );
  }

  const widths = flexRatioClasses(ratio);

  return (
    <div
      className={sectionClassNames(
        "flex flex-col",
        DS_SPLIT_GAP[gap],
        "lg:flex-row",
        className
      )}
    >
      <div className={sectionClassNames("min-w-0", widths.left, leftClassName)}>
        {left}
      </div>
      <div
        className={sectionClassNames("min-w-0", widths.right, rightClassName)}
      >
        {right}
      </div>
    </div>
  );
}
