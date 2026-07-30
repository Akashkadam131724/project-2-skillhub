/**
 * Resolve page-theme band fill for a section row (no section override).
 */

import { isPageSurfaceTransparent, resolveSurfacePattern } from "@/lib/theme";

function themeBandFillValue(raw) {
  if (raw === null || raw === undefined) return "";
  const value = String(raw).trim();
  if (!value || value === "undefined" || value === "null") return "";
  return value;
}

export function resolvePageBandFill(pageTheme, surfaceBand, surfaceTone) {
  const theme = pageTheme || {};
  const pattern = resolveSurfacePattern(theme);
  if (isPageSurfaceTransparent(pattern)) return "";

  const isDarkRow =
    surfaceBand?.theme === "dark" ||
    surfaceTone === "dark" ||
    surfaceTone === "dark_ink" ||
    (pattern.layout === "solid" &&
      pattern.bands[0] &&
      String(pattern.bands[0].bg).includes("ink"));

  const primary = themeBandFillValue(
    isDarkRow ? theme.surface_band_dark_fill : theme.surface_band_fill
  );
  const alt = themeBandFillValue(
    isDarkRow ? theme.surface_band_dark_fill_alt : theme.surface_band_fill_alt
  );

  if (!primary && !alt) return "";
  return primary || alt;
}
