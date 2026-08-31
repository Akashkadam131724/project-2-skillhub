import { navFetchOptions, NAVIGATION_CACHE_TAG } from "@/lib/cache/isr";
import { logFetchResult } from "@/lib/cache/cache-log";

export { getHeaderNavMode, isApiHeaderNav } from "./header-nav-mode";

const NAV_API_URL =
  process.env.NAV_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_NAV_API_URL ||
  "http://localhost:3005";

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
      error: err instanceof Error ? err.message : "Could not reach navigation API",
    };
  }
}

export { NAVIGATION_CACHE_TAG };
