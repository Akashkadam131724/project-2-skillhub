import { getPage, getSiteTheme } from "@/lib/api/cms-api";
import { mergeTheme } from "@/lib/theme";

/** SSR theme for live-edit pages (no section resolve). */
export async function fetchLiveEditPageTheme(pageKey) {
  const [pageRes, siteRes] = await Promise.all([
    getPage(pageKey).catch(() => null),
    getSiteTheme().catch(() => null),
  ]);
  return mergeTheme(siteRes?.data, pageRes?.data?.theme);
}
