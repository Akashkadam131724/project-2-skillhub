/**
 * Dev layout ruler — alignment overlay for SectionWrapper (1440px rail).
 *
 * Set in client `.env.local`:
 *   NEXT_PUBLIC_DEV_LAYOUT_RULER=true   — on by default (Alt+Shift+G to toggle)
 *   NEXT_PUBLIC_DEV_LAYOUT_RULER=visible — same as true
 *   NEXT_PUBLIC_DEV_LAYOUT_RULER=false  — disabled
 *
 * Toggle on the page: Alt + Shift + G or ⌘/Ctrl + Shift + G
 */
export function getDevLayoutRulerEnv() {
  return String(process.env.NEXT_PUBLIC_DEV_LAYOUT_RULER || "")
    .trim()
    .toLowerCase();
}

export function isDevLayoutRulerAvailable() {
  if (process.env.NODE_ENV === "production") return false;

  const raw = getDevLayoutRulerEnv();
  if (!raw || raw === "false" || raw === "0" || raw === "off") return false;

  return (
    raw === "true" ||
    raw === "1" ||
    raw === "on" ||
    raw === "visible"
  );
}

/** Default on when env is enabled (unless localStorage explicitly turned off). */
export function devLayoutRulerDefaultVisible() {
  if (!isDevLayoutRulerAvailable()) return false;
  const raw = getDevLayoutRulerEnv();
  return (
    raw === "visible" ||
    raw === "true" ||
    raw === "1" ||
    raw === "on"
  );
}
