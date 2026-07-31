import { getSiteTheme } from "@/lib/cms-api";
import { defaultSiteTheme } from "@/lib/theme";

/** Site theme for root layout — cached briefly to avoid hammering the API. */
export async function fetchSiteThemeForLayout() {
  try {
    const res = await getSiteTheme({ next: { revalidate: 60 } });
    if (res?.data && typeof res.data === "object") {
      return { ...defaultSiteTheme(), ...res.data };
    }
  } catch {
    /* fall through to defaults */
  }
  return defaultSiteTheme();
}
