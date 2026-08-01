/**
 * CMS live-edit vs public URL helpers.
 *
 * Public pages:     /vendor/{slug}, /about-us, …
 * Live section edit: /cms/vendor/edit/{slug}, /cms/content/edit/about-us, …
 * Entity metadata:   /cms/vendor/{slug} (singular)
 * Admin lists:       /cms/vendors, …
 */

const CMS_ENTITY_TYPES = {
  vendor: {
    pageKey: "vendor",
    segment: "vendor",
    listPath: "/cms/vendors",
    publicPrefix: "/vendor",
  },
  product: {
    pageKey: "product",
    segment: "product",
    listPath: "/cms/products",
    publicPrefix: "/product",
  },
  course: {
    pageKey: "course",
    segment: "course",
    listPath: "/cms/courses",
    publicPrefix: "/course",
  },
  industry: {
    pageKey: "industry",
    segment: "industry",
    listPath: "/cms/industries",
    publicPrefix: "/industry",
  },
  skilling_area: {
    pageKey: "skilling_area",
    segment: "skilling-area",
    listPath: "/cms/skilling-areas",
    publicPrefix: "/skilling-area",
  },
  blog: {
    pageKey: "blog",
    segment: "blog",
    listPath: "/cms/blogs",
    publicPrefix: "/blog",
  },
  home: {
    pageKey: "home",
    segment: "home",
    listPath: "/cms/contents",
    publicPrefix: "/",
  },
  content: {
    pageKey: "content",
    segment: "content",
    listPath: "/cms/contents",
    publicPrefix: null,
  },
};

const PUBLIC_PATH_RE =
  /^\/(vendor|product|course|industry|skilling-area|blog)\/([^/]+)\/?$/;

export function cmsPublicHref(pageKey, slugOrPath) {
  if (pageKey === "home") return "/";
  if (pageKey === "content") {
    const raw = String(slugOrPath || "").trim();
    if (!raw || raw === "/") return "/";
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
  const type = CMS_ENTITY_TYPES[pageKey];
  if (!type?.publicPrefix) return "/";
  return `${type.publicPrefix}/${encodeURIComponent(String(slugOrPath || "").trim())}`;
}

export function cmsEditHref(pageKey, slugOrPath) {
  if (pageKey === "home") return "/cms/home/edit";
  if (pageKey === "content") {
    const raw = String(slugOrPath || "")
      .trim()
      .replace(/^\/+/, "");
    return raw ? `/cms/content/edit/${raw}` : "/cms/content/edit";
  }
  const type = CMS_ENTITY_TYPES[pageKey];
  if (!type) return "/cms";
  return `/cms/${type.segment}/edit/${encodeURIComponent(String(slugOrPath || "").trim())}`;
}

function cmsMetaHref(pageKey, slug) {
  const type = CMS_ENTITY_TYPES[pageKey];
  if (!type || pageKey === "home" || pageKey === "content") {
    return type?.listPath || "/cms";
  }
  return `/cms/${type.segment}/${encodeURIComponent(String(slug || "").trim())}`;
}

function cmsListHref(pageKey) {
  return CMS_ENTITY_TYPES[pageKey]?.listPath || "/cms";
}

/** Default exit target from live edit bar (metadata form or list). */
export function cmsEditExitHref(pageKey, slug) {
  if (pageKey === "home" || pageKey === "content") {
    return cmsListHref(pageKey);
  }
  if (slug) return cmsMetaHref(pageKey, slug);
  return cmsListHref(pageKey);
}

/** Map a public pathname to a live-edit href (CmsModeToggle FAB). */
export function cmsEditHrefFromPublicPath(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  if (path === "/") return cmsEditHref("home");

  const entityMatch = path.match(PUBLIC_PATH_RE);
  if (entityMatch) {
    const [, segment, slug] = entityMatch;
    const pageKey = Object.values(CMS_ENTITY_TYPES).find(
      (t) => t.segment === segment
    )?.pageKey;
    if (pageKey) return cmsEditHref(pageKey, decodeURIComponent(slug));
  }

  return cmsEditHref("content", path.replace(/^\//, ""));
}
