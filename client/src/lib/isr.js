/** Nav header fetch cache only — entity pages use SSR (no-store). */
export const NAV_CACHE_REVALIDATE_SECONDS = 3600;

/** Shared by SiteHeader nav fetch; refresh via POST /api/publish/navigation. */
export const NAVIGATION_CACHE_TAG = "navigation";

export function navFetchOptions() {
  return {
    next: {
      revalidate: NAV_CACHE_REVALIDATE_SECONDS,
      tags: [NAVIGATION_CACHE_TAG],
    },
  };
}
