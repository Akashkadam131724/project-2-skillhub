import { googleFontsStylesheetHref } from "@/lib/theme";

/** Loads any site / page theme fonts that are not bundled via next/font. */
export default function ThemeFontLinks({ theme }: { theme?: unknown }) {
  const href = googleFontsStylesheetHref(theme);
  if (!href) return null;
  return <link rel="stylesheet" href={href} />;
}
