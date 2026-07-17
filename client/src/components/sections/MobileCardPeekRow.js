"use client";

import { Children } from "react";

/**
 * Fixed media heights on phone peek cards;
 * aspect-ratio from sm+ grid (matches desktop web).
 */
export const CARD_MEDIA_LANDSCAPE =
  "relative h-56 w-full shrink-0 overflow-hidden sm:aspect-[16/10] sm:h-auto";

export const CARD_MEDIA_PORTRAIT =
  "relative h-80 w-full shrink-0 overflow-hidden sm:aspect-[3/4] sm:h-auto";

export const CARD_MEDIA_PORTRAIT_TEAM =
  "relative h-80 w-full shrink-0 overflow-hidden sm:aspect-[4/5] sm:h-auto";

/**
 * Card list — horizontal snap/peek on phones only;
 * from sm up: reduced-column grid / flex (no carousel).
 */
export default function MobileCardPeekRow({
  gridClassName = "",
  gapClassName = "gap-4",
  className = "",
  gridFrom = "sm",
  children,
}) {
  const responsiveListClass =
    gridFrom === "md"
      ? "md:grid md:overflow-visible md:scroll-pl-0 md:px-0 md:pb-0 md:snap-none"
      : "sm:grid sm:overflow-visible sm:scroll-pl-0 sm:px-0 sm:pb-0 sm:snap-none";
  const responsiveItemClass =
    gridFrom === "md"
      ? "md:basis-auto md:min-w-0 md:shrink"
      : "sm:basis-auto sm:min-w-0 sm:shrink";

  const listClass = [
    "flex",
    "items-stretch",
    gapClassName,
    // Phone: app-like hidden-scrollbar row that stays inside the section width.
    "w-full max-w-full overflow-x-auto overscroll-x-contain snap-x snap-mandatory",
    "scroll-pl-1 px-1 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
    responsiveListClass,
    gridClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const itemClass = `flex basis-[78%] shrink-0 snap-start ${responsiveItemClass}`;

  return (
    <ul className={`m-0 list-none p-0 ${listClass} ${className}`.trim()}>
      {Children.map(children, (child, index) => (
        <li key={child?.key ?? index} className={itemClass}>
          <div className="flex h-full w-full min-w-0 flex-col">{child}</div>
        </li>
      ))}
    </ul>
  );
}
