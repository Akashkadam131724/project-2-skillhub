import { navFetchOptions, NAVIGATION_CACHE_TAG } from "@/lib/isr";
import { logFetchResult } from "@/lib/cache-log";

const NAV_API_URL =
  process.env.NAV_API_URL ||
  process.env.NEXT_PUBLIC_NAV_API_URL ||
  "http://localhost:4000";

const navCache = navFetchOptions();

export async function getNavigationTree() {
  try {
    const redisRes = await fetch(
      `${NAV_API_URL}/navigation/get/reddis`,
      navCache
    );
    logFetchResult("nav /navigation/get/reddis", redisRes, navCache);

    if (redisRes.ok) {
      const data = await redisRes.json();
      return { navigation: data.navigation || [], error: null };
    }

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
      error: err.message || "Could not reach navigation server on :4000",
    };
  }
}
