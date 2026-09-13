/**
 * SkillHub API route catalog — single source of truth, grouped by feature.
 *
 *   API.catalog.*    vendors, products, courses
 *   API.skilling.*   areas, levels, industries
 *   API.content      static / marketing pages
 *   API.blog         blog posts
 *   API.cms.*        templates, sections, placements, theme
 *   API.site.*       navigation, search, uploads
 *
 * Used by client `lib/api/*.ts` and `postman/build-collection.mjs`.
 * Pass Postman vars like `"{{pageKey}}"` — `enc()` leaves `{{…}}` unencoded.
 */

/** Encode a path segment; leave Postman `{{var}}` placeholders alone. */
export function enc(value) {
  const v = String(value ?? "");
  if (/^\{\{[^{}]+\}\}$/.test(v)) return v;
  return encodeURIComponent(v);
}

/**
 * @param {string} path
 * @param {string} [query] raw query without `?` (e.g. `q=x&limit=6`)
 */
export function withQuery(path, query) {
  if (!query) return path;
  const q = String(query).replace(/^\?/, "");
  return q ? `${path}?${q}` : path;
}

const catalog = {
  vendors: {
    root: "/vendors",
    one: (slug) => `/vendors/${enc(slug)}`,
    restore: (slug) => `/vendors/${enc(slug)}/restore`,
    searchFilters: "/vendors/search/filters",
  },
  products: {
    root: "/products",
    one: (slug) => `/products/${enc(slug)}`,
    restore: (slug) => `/products/${enc(slug)}/restore`,
    byVendor: (vendorId) => `/products/vendor/${enc(vendorId)}`,
  },
  courses: {
    root: "/courses",
    one: (slug) => `/courses/${enc(slug)}`,
    restore: (slug) => `/courses/${enc(slug)}/restore`,
    catalog: "/courses/catalog",
    catalogFilters: "/courses/catalog/filters",
    byProduct: (productId) => `/courses/product/${enc(productId)}`,
  },
};

const skilling = {
  areas: {
    root: "/skilling-areas",
    one: (slug) => `/skilling-areas/${enc(slug)}`,
    restore: (slug) => `/skilling-areas/${enc(slug)}/restore`,
    courses: (idOrSlug) => `/skilling-areas/${enc(idOrSlug)}/courses`,
    mapCourse: (courseId) => `/skilling-areas/map/course/${enc(courseId)}`,
  },
  levels: {
    root: "/skill-levels",
    one: (slug) => `/skill-levels/${enc(slug)}`,
    restore: (slug) => `/skill-levels/${enc(slug)}/restore`,
    courses: (idOrSlug) => `/skill-levels/${enc(idOrSlug)}/courses`,
  },
  industries: {
    root: "/industries",
    one: (slug) => `/industries/${enc(slug)}`,
    restore: (slug) => `/industries/${enc(slug)}/restore`,
    courses: (idOrSlug) => `/industries/${enc(idOrSlug)}/courses`,
    mapCourse: (courseId) => `/industries/map/course/${enc(courseId)}`,
  },
};

const content = {
  root: "/contents",
  one: (slug) => `/contents/${enc(slug)}`,
  restore: (slug) => `/contents/${enc(slug)}/restore`,
};

const blog = {
  root: "/blogs",
  one: (slug) => `/blogs/${enc(slug)}`,
  restore: (slug) => `/blogs/${enc(slug)}/restore`,
};

const cms = {
  pages: {
    root: "/pages",
    one: (key) => `/pages/${enc(key)}`,
    status: (key) => `/pages/${enc(key)}/status`,
    sections: (key) => `/pages/${enc(key)}/sections`,
  },
  siteTheme: {
    root: "/site-theme",
  },
  entityPageTheme: {
    root: "/entity-page-theme",
  },
  sectionCategories: {
    root: "/section-categories",
    one: (key) => `/section-categories/${enc(key)}`,
  },
  sections: {
    root: "/sections",
    one: (key) => `/sections/${enc(key)}`,
    status: (key) => `/sections/${enc(key)}/status`,
    pages: (key) => `/sections/${enc(key)}/pages`,
    pageTag: (sectionKey, pageKey) =>
      `/sections/${enc(sectionKey)}/pages/${enc(pageKey)}`,
    tag: (sectionKey, tagId) =>
      `/sections/${enc(sectionKey)}/pages/tag/${enc(tagId)}`,
    byPage: (sectionKey, pageKey) =>
      `/sections/${enc(sectionKey)}/pages/by-page/${enc(pageKey)}`,
  },
  pageSections: {
    root: "/page-sections",
    one: (id) => `/page-sections/${enc(id)}`,
    status: (id) => `/page-sections/${enc(id)}/status`,
    reorder: "/page-sections/reorder",
    entity: "/page-sections/entity",
    entityOne: (id) => `/page-sections/entity/${enc(id)}`,
  },
  sectionLibrary: {
    categories: "/section-library/categories",
    showcase: "/section-library/showcase",
    showcaseOne: (key) => `/section-library/showcase/${enc(key)}`,
  },
};

const site = {
  navigation: {
    root: "/navigation",
    filter: "/navigation/filter",
    columns: "/navigation/columns",
    columnLinks: "/navigation/column/links",
    one: (id) => `/navigation/${enc(id)}`,
  },
  search: {
    root: "/search",
  },
  uploads: {
    api: "/api/uploads",
  },
};

export const API = {
  catalog,
  skilling,
  content,
  blog,
  cms,
  site,
};

export default API;
