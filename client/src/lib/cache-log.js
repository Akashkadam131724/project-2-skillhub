/**
 * Server-side ISR / publish logging.
 * Enable Next’s own fetch HIT/MISS table via next.config `logging.fetches`.
 * Toggle with CACHE_LOG=0 to silence custom logs (Next fetch logs still apply).
 */

const ENABLED = process.env.CACHE_LOG !== "0";

function stamp() {
  return new Date().toISOString().slice(11, 23);
}

export function cacheLog(scope, message, extra) {
  if (!ENABLED) return;
  // Only meaningful on the server (Next data cache lives there)
  if (typeof window !== "undefined") return;
  if (extra !== undefined) {
    console.log(`[${stamp()}] [${scope}] ${message}`, extra);
  } else {
    console.log(`[${stamp()}] [${scope}] ${message}`);
  }
}

/** Infer / read whether a fetch used Next data cache. */
export function readFetchCacheStatus(res) {
  if (!res?.headers) return "unknown";
  const next =
    res.headers.get("x-nextjs-cache") ||
    res.headers.get("X-Nextjs-Cache") ||
    res.headers.get("x-vercel-cache");
  if (next) return String(next).toUpperCase();

  const age = res.headers.get("age");
  if (age != null && age !== "" && Number(age) > 0) {
    return `HIT (age=${age}s)`;
  }
  return "unknown — see Next fetch log (cache hit|miss|skip)";
}

/**
 * Log after a server fetch. Pass the init used so we can label the strategy.
 * @returns {string} status label
 */
export function logFetchResult(label, res, init = {}) {
  const strategy = describeFetchStrategy(init);
  const status = strategy.startsWith("no-store")
    ? "FETCH (no-store)"
    : readFetchCacheStatus(res);
  const ok = res?.ok ? res.status : `ERR ${res?.status ?? "?"}`;
  cacheLog(
    "fetch",
    `${label} → ${status} · http ${ok} · ${strategy}`
  );
  return status;
}

export function describeFetchStrategy(init = {}) {
  if (init.next?.tags || init.next?.revalidate != null) {
    const tags = (init.next.tags || []).join(", ") || "(none)";
    const rev =
      init.next.revalidate === false
        ? "false"
        : init.next.revalidate ?? "?";
    return `ISR tags=[${tags}] revalidate=${rev}s`;
  }
  if (init.cache === "force-cache") return "force-cache";
  if (init.cache === "no-store" || (!init.cache && !init.next)) {
    return "no-store (always fetch)";
  }
  return init.cache || "default";
}

export function logPublish(kind, details) {
  cacheLog("publish", kind, details);
}
