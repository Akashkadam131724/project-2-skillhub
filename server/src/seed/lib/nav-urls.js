/**
 * Normalize header URLs to client routes (plural catalog hubs, singular entity detail).
 */
export function normalizeNavUrl(url) {
  const u = String(url || "").trim();
  if (!u.startsWith("/")) return u;
  if (u === "/vendors" || u === "/products" || u === "/courses" || u === "/industries" || u === "/skilling-areas") {
    return u;
  }
  if (u.startsWith("/vendors/")) return `/vendor/${u.slice(9)}`;
  if (u.startsWith("/products/")) return `/product/${u.slice(10)}`;
  if (u.startsWith("/industries/")) return `/industry/${u.slice(12)}`;
  if (u.startsWith("/skilling-areas/")) return `/skilling-area/${u.slice(16)}`;
  if (u.startsWith("/courses/")) return `/course/${u.slice(9)}`;
  if (u.startsWith("/blogs/")) return `/blog/${u.slice(7)}`;
  return u;
}

/** Collect every URL from navigation seed tree. */
export function collectNavUrls(seedData) {
  const urls = [];
  for (const nav of seedData || []) {
    for (const col of nav.columns || []) {
      for (const link of col.links || []) {
        if (link?.url) urls.push(link.url);
      }
    }
  }
  return urls;
}

/** Static content paths (not entity detail slugs). */
export function isStaticContentPath(url) {
  const u = String(url || "");
  if (!u || u === "/") return false;
  if (/^\/(vendor|product|industry|skilling-area|course|blog)\/[^/]+$/.test(u)) {
    return false;
  }
  return true;
}
