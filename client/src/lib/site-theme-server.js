import { getSiteTheme } from "@/lib/cms-api";
import { defaultSiteTheme } from "@/lib/theme";

/** Site theme for root layout — fresh on every request (no ISR cache). */
export async function fetchSiteThemeForLayout() {
  try {
    const res = await getSiteTheme({ cache: "no-store" });
    if (res?.data && typeof res.data === "object") {
      return { ...defaultSiteTheme(), ...res.data };
    }
  } catch {
    /* fall through to defaults */
  }
  return defaultSiteTheme();
}
