"use client";

import { pageBgStyle, themeCssVars } from "@/lib/theme";
import type { CSSProperties } from "react";
import type { PageThemeShellProps } from "./types";

/**
 * Applies resolved page theme (CSS vars). Optional solid surface fill only —
 * page_bg_* and section bands are retired.
 */
export default function PageThemeShell({
  theme,
  children,
  className = "",
}: PageThemeShellProps) {
  const cssVars = themeCssVars(theme);
  const bg = pageBgStyle(theme);

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
