"use client";

import { mediaUrl } from "@/lib/cms-api";
import { pageBgStyle, themeCssVars } from "@/lib/theme";

/**
 * Applies resolved page theme (CSS vars + optional page background)
 * around live / CMS section stacks.
 *
 * Page bg shows through when surface mode is transparent, or in any gaps
 * between sections. Sections with their own section_bg_* still paint over it.
 */
export default function PageThemeShell({ theme, children, className = "" }) {
  const cssVars = themeCssVars(theme);
  const bg = pageBgStyle({
    ...theme,
    page_bg_img: mediaUrl(theme?.page_bg_img) || theme?.page_bg_img,
  });

  return (
    <div
      className={`page-theme-shell min-w-0 ${className}`.trim()}
      style={{ ...cssVars, ...bg }}
      data-theme-preset={theme?.preset || undefined}
      data-surface-mode={theme?.surface_mode || undefined}
    >
      {children}
    </div>
  );
}
