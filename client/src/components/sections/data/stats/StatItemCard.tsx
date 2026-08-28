"use client";

import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { itemStatLabel, itemStatValue } from "@/lib/sections/item-types";

type StatItemCardProps = {
  item?: Record<string, unknown>;
  preview?: boolean;
  className?: string;
  variant?: "dark" | "light";
};

export default function StatItemCard({
  item = {},
  preview = false,
  className = "",
  variant = "dark",
}: StatItemCardProps) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item);
  const light = variant === "light";

  return (
    <div
      data-light-surface={light ? "" : undefined}
      className={`flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10 ${
        light ? "section-ui-card rounded-xl border" : ""
      } ${className}`.trim()}
    >
      <p
        className={
          light
            ? "m-0 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            : "section-theme-heading m-0 text-3xl font-bold tracking-tight sm:text-4xl"
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
