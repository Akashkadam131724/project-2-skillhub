"use client";

import { itemStatLabel, itemStatValue } from "@/lib/item-types";
import CardPlaceholder from "./CardPlaceholder";

export default function StatItemCard({
  item,
  preview = false,
  className = "",
  variant = "dark",
}) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item);
  const light = variant === "light";

  return (
    <div
      data-light-surface={light ? "" : undefined}
      className={`flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10 ${
        light ? "rounded-xl section-ui-card border" : ""
      } ${className}`.trim()}
    >
      <p
        className={
          light
            ? "m-0 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            : "m-0 text-3xl font-bold tracking-tight section-theme-heading sm:text-4xl"
        }
      >
        {value || (preview ? <CardPlaceholder>0</CardPlaceholder> : null)}
      </p>
      <p
        className={
          light
            ? "mt-2 mb-0 max-w-[14rem] text-sm leading-snug text-slate-600 sm:max-w-[14rem] sm:text-[15px]"
            : "mt-2 mb-0 max-w-[12rem] text-sm leading-snug text-slate-500 sm:max-w-[14rem] sm:text-[15px] dark:text-slate-400"
        }
      >
        {label || (preview ? <CardPlaceholder>Label</CardPlaceholder> : null)}
      </p>
    </div>
  );
}
