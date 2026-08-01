/**
 * Site header navigation source.
 *
 *   static — code-defined ProjectNav (demo / showcase links)
 *   api    — GET /navigation mega-menu from MongoDB
 *
 * Set in client `.env.local`:
 *   NEXT_PUBLIC_HEADER_NAV=api
 * or (server-only):
 *   HEADER_NAV=api
 */
export function getHeaderNavMode() {
  const raw = String(
    process.env.HEADER_NAV ||
      process.env.NEXT_PUBLIC_HEADER_NAV ||
      "static"
  )
    .trim()
    .toLowerCase();

  if (raw === "api" || raw === "dynamic") return "api";
  return "static";
}

export function isApiHeaderNav() {
  return getHeaderNavMode() === "api";
}
