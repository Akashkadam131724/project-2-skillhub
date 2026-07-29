/**
 * Resolve page-theme band fill for a section row (no section override).
 */

export function resolvePageBandFill(pageTheme, surfaceTone) {
  const theme = pageTheme || {};
  const mode = String(theme.surface_mode || "alternating").toLowerCase();
  const isDarkRow = mode === "dark" || surfaceTone === "dark";

  const primary = String(
    isDarkRow ? theme.surface_band_dark_fill : theme.surface_band_fill
  ).trim();
  const alt = String(
    isDarkRow ? theme.surface_band_dark_fill_alt : theme.surface_band_fill_alt
  ).trim();

  if (!primary && !alt) return "";

  if (isDarkRow) {
    if (mode === "alternating" && surfaceTone === "dark") {
      return primary || alt;
    }
    return primary || alt;
  }

  if (mode === "light" || surfaceTone === "white") {
    return primary || alt;
  }
  if (mode === "muted" || surfaceTone === "muted") {
    return alt || primary;
  }
  if (mode === "alternating") {
    if (surfaceTone === "muted") return alt || primary;
    if (surfaceTone === "white") return primary || alt;
  }

  return primary || alt;
}
