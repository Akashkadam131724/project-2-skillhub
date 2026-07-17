/**
 * Content-driven marketing pages.
 *
 * DB: Content.path is the real public URL (`/`, `/about-us`, `/company/careers`).
 * Content.slug is the API id (no slashes).
 *
 * `/` uses Page key `home` (dedicated template — useful for page-level permissions later).
 * Other Content URLs use Page key `content` (blank / free-form).
 */

export const CONTENT_PAGE_KEY = "content";
export const HOME_PAGE_KEY = "home";

/**
 * First URL segments claimed by hard-coded app routes (not Content catch-all).
 * Catalog indexes (`/vendors`, `/products`, …) are Content pages.
 * Singular segments are reserved for detail routes (`/vendor/:slug`, …).
 */
export const RESERVED_CONTENT_SEGMENTS = new Set([
  "api",
  "cms",
  "vendor",
  "product",
  "industry",
  "skilling-area",
  "course",
  "blog",
  "course-catalog",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

/** Content.path → entity_directory type for listing pages. */
export const CONTENT_DIRECTORY_BY_PATH = {
  "/vendors": "vendor",
  "/products": "product",
  "/industries": "industry",
  "/skilling-areas": "skilling_area",
};

/** Normalize to a real URL path (leading `/`, no trailing slash except root). */
export function normalizeContentPath(value) {
  let p = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\/+/g, "/");
  if (!p || p === "/") return "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/**
 * Map catch-all params → Content.path
 * `/about-us` → `/about-us`
 * `/company/careers` → `/company/careers`
 */
export function contentPathFromParams(slugParam) {
  const parts = (Array.isArray(slugParam) ? slugParam : [slugParam])
    .map((p) => String(p || "").trim().toLowerCase())
    .filter(Boolean);
  return normalizeContentPath(parts.join("/"));
}

export function isReservedContentPath(slugParam) {
  const parts = Array.isArray(slugParam) ? slugParam : [slugParam];
  const first = String(parts[0] || "")
    .trim()
    .toLowerCase();
  return RESERVED_CONTENT_SEGMENTS.has(first);
}

/** Public href — Content.path is already the URL. */
export function contentPublicHref(contentOrPath) {
  let path = "";
  if (contentOrPath && typeof contentOrPath === "object") {
    path = contentOrPath.path || "";
  } else {
    path = contentOrPath || "";
  }
  return normalizeContentPath(path);
}

export function contentCmsHref(contentOrPath) {
  const href = contentPublicHref(contentOrPath);
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}cms=1`;
}

export function slugFromPath(path) {
  const p = normalizeContentPath(path);
  if (p === "/") return "home";
  return p.slice(1).replace(/\//g, "-");
}
