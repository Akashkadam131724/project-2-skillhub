import type { CSSProperties } from "react";

/** Dark-band gradient — ink + brand from site / page theme CSS vars. */
export const VENDOR_LINKS_GRID_DARK_GRADIENT_STYLE: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse at 18% 12%, color-mix(in srgb, var(--brand) 38%, transparent) 0%, transparent 52%)",
    "radial-gradient(ellipse at 88% 88%, color-mix(in srgb, var(--brand) 26%, transparent) 0%, transparent 46%)",
    "linear-gradient(135deg, var(--ink) 0%, color-mix(in srgb, var(--ink) 58%, var(--brand) 42%) 48%, color-mix(in srgb, var(--brand) 45%, var(--ink) 55%) 100%)",
  ].join(", "),
};
