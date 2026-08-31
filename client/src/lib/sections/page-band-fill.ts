/**
 * Resolve page-theme band fill for a section row (no section override).
 */

import { isPageSurfaceTransparent, resolveSurfacePattern } from "@/lib/theme";
import type { SurfaceBandLike } from "@/lib/theme/surface-patterns";

function themeBandFillValue(raw: unknown) {
  if (raw === null || raw === undefined) return "";
  const value = String(raw).trim();
  if (!value || value === "undefined" || value === "null") return "";
  return value;
}

export function resolvePageBandFill(
  pageTheme: Record<string, unknown> | null | undefined,
  surfaceBand: SurfaceBandLike | null | undefined,
  surfaceTone: unknown,
  surfaceBandIndex?: number | null
) {
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

  if (
    pattern.layout === "cycle" &&
    pattern.bands.length > 1 &&
    surfaceBandIndex !== undefined &&
    surfaceBandIndex !== null
  ) {
    const slot = Math.max(0, Number(surfaceBandIndex) || 0);
    const useAltFill =
      pattern.bands.length === 2
        ? slot % 2 === 1
        : slot % pattern.bands.length >= Math.ceil(pattern.bands.length / 2);
    return (useAltFill ? alt : primary) || (useAltFill ? primary : alt);
  }

  return primary || alt;
}
