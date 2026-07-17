import { logFetchResult } from "@/lib/cache-log";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function toQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (!value.length) return;
      search.set(key, value.join(","));
      return;
    }
    search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function apiGet(path, { notFoundMessage, next, cache } = {}) {
  const init = {};
  if (next) init.next = next;
  else if (cache) init.cache = cache;
  else init.cache = "no-store";

  const res = await fetch(`${API_URL}${path}`, init);
  logFetchResult(`api GET ${path}`, res, init);
  if (res.status === 404) {
    const err = new Error(notFoundMessage || "Not found");
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Request failed");
  }
  return res.json();
}

export async function fetchCatalog(params = {}) {
  return apiGet(`/courses/catalog${toQuery(params)}`);
}

export async function fetchCatalogFilters(params = {}) {
  return apiGet(`/courses/catalog/filters${toQuery(params)}`);
}

export async function fetchGlobalSearch({ q, limit = 6 } = {}) {
  return apiGet(`/search${toQuery({ q, limit })}`);
}

export async function fetchVendors(params = {}) {
  return apiGet(`/vendors${toQuery(params)}`);
}

export async function fetchVendorBySlug(slug, options = {}) {
  return apiGet(`/vendors/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Vendor not found",
    ...options,
  });
}

export async function fetchProducts(params = {}) {
  return apiGet(`/products${toQuery(params)}`);
}

export async function fetchProductsByVendor(vendorId, params = {}) {
  return apiGet(
    `/products/vendor/${encodeURIComponent(vendorId)}${toQuery(params)}`
  );
}

export async function fetchProductBySlug(slug, options = {}) {
  return apiGet(`/products/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Product not found",
    ...options,
  });
}

export async function fetchCourses(params = {}) {
  return apiGet(`/courses${toQuery(params)}`);
}

export async function fetchCoursesByProduct(productId, params = {}) {
  return apiGet(
    `/courses/product/${encodeURIComponent(productId)}${toQuery(params)}`
  );
}

export async function fetchSkillLevels(params = {}) {
  return apiGet(`/skill-levels${toQuery(params)}`);
}

export async function fetchCourseBySlug(slug, options = {}) {
  return apiGet(`/courses/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Course not found",
    ...options,
  });
}

export async function fetchIndustries(params = {}) {
  return apiGet(`/industries${toQuery(params)}`);
}

export async function fetchIndustryBySlug(slug, options = {}) {
  return apiGet(`/industries/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Industry not found",
    ...options,
  });
}

export async function fetchCoursesByIndustry(idOrSlug, params = {}) {
  return apiGet(
    `/industries/${encodeURIComponent(idOrSlug)}/courses${toQuery(params)}`
  );
}

export async function fetchSkillingAreas(params = {}) {
  return apiGet(`/skilling-areas${toQuery(params)}`);
}

export async function fetchSkillingAreaBySlug(slug, options = {}) {
  return apiGet(`/skilling-areas/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Skilling area not found",
    ...options,
  });
}

export async function fetchCoursesBySkillingArea(idOrSlug, params = {}) {
  return apiGet(
    `/skilling-areas/${encodeURIComponent(idOrSlug)}/courses${toQuery(params)}`
  );
}

export async function fetchContents(params = {}) {
  return apiGet(`/contents${toQuery(params)}`);
}

export async function fetchContentBySlug(slug, options = {}) {
  return apiGet(`/contents/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Content not found",
    ...options,
  });
}

/** Lookup by public path (`about-us` or `company/careers`). */
export async function fetchContentByPath(path, options = {}) {
  return apiGet(`/contents${toQuery({ path })}`, {
    notFoundMessage: "Content not found",
    ...options,
  });
}

export async function fetchBlogs(params = {}) {
  return apiGet(`/blogs${toQuery(params)}`);
}

export async function fetchBlogBySlug(slug, options = {}) {
  return apiGet(`/blogs/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Blog not found",
    ...options,
  });
}
