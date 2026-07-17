import { navFetchOptions, NAVIGATION_CACHE_TAG } from "@/lib/isr";
import { logFetchResult } from "@/lib/cache-log";

const NAV_API_URL =
  process.env.NAV_API_URL ||
  process.env.NEXT_PUBLIC_NAV_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

const navCache = navFetchOptions();

export async function getNavigationTree() {
  try {
    const res = await fetch(`${NAV_API_URL}/navigation`, navCache);
    logFetchResult("nav /navigation", res, navCache);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        navigation: [],
        error: err.message || "Failed to load navigation",
      };
    }

    const data = await res.json();
    return { navigation: data.navigation || [], error: null };
  } catch (err) {
    return {
      navigation: [],
      error: err.message || "Could not reach navigation API",
    };
  }
}
