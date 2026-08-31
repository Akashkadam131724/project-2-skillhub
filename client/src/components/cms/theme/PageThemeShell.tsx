"use client";

import { mediaUrl } from "@/lib/api/cms-api";
import { pageBgStyle, themeCssVars } from "@/lib/theme";
import type { CSSProperties } from "react";
import type { PageThemeShellProps } from "./types";

/**
 * Applies resolved page theme (CSS vars + optional page background)
 * around live / CMS section stacks.
 *
 * Page bg shows through when surface mode is transparent, or in any gaps
 * between sections. Sections with their own section_bg_* still paint over it.
 */
export default function PageThemeShell({
  theme,
  children,
  className = "",
}: PageThemeShellProps) {
  const cssVars = themeCssVars(theme);
  const bg = pageBgStyle({
    ...theme,
    page_bg_img: mediaUrl(String(theme?.page_bg_img || "")) || theme?.page_bg_img,
  });

  return (
    <div
      className={`page-theme-shell min-w-0 ${className}`.trim()}
      style={{ ...cssVars, ...bg } as CSSProperties}
      data-theme-preset={(theme?.preset as string | undefined) || undefined}
      data-surface-mode={(theme?.surface_mode as string | undefined) || undefined}
    >
      {children}
    </div>
  );
}
