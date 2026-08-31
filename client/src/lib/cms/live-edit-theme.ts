import { getPage, getSiteTheme } from "@/lib/api/cms-api";
import { mergeTheme } from "@/lib/theme";
import type { PageThemeDraft } from "@/components/cms/theme/types";

/** SSR theme for live-edit pages (no section resolve). */
export async function fetchLiveEditPageTheme(pageKey: string): Promise<PageThemeDraft> {
  const [pageRes, siteRes] = await Promise.all([
    getPage(pageKey).catch(() => null),
    getSiteTheme().catch(() => null),
  ]);
  return mergeTheme(siteRes?.data, pageRes?.data?.theme) as PageThemeDraft;
}
