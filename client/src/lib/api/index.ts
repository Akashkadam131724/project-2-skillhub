import { logFetchResult } from "@/lib/cache/cache-log";
import type { ApiGetOptions, ApiItemResponse, ApiListResponse, QueryParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function toQuery(params: QueryParams = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (!value.length) return;
      search.set(key, value.join(","));
      return;
    }
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function apiGet<T = unknown>(path: string, options: ApiGetOptions = {}) {
  const { notFoundMessage, next, cache } = options;
  const init: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {};
  if (next) init.next = next;
  else if (cache) init.cache = cache;
  else init.cache = "no-store";

  const res = await fetch(`${API_URL}${path}`, init);
  logFetchResult(`api GET ${path}`, res, init);
  if (res.status === 404) {
    const err = new Error(notFoundMessage || "Not found") as Error & {
      status?: number;
    };
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function fetchCatalog(params: QueryParams = {}) {
  return apiGet<ApiListResponse<Record<string, unknown>>>(
    `/courses/catalog${toQuery(params)}`
  );
}

export async function fetchCatalogFilters(params: QueryParams = {}) {
  return apiGet(`/courses/catalog/filters${toQuery(params)}`);
}

export async function fetchGlobalSearch({
  q,
  limit = 6,
}: { q?: string; limit?: number } = {}) {
  return apiGet(`/search${toQuery({ q, limit })}`);
}

export async function fetchVendors(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/vendors${toQuery(params)}`);
}

export async function fetchVendorBySlug(slug: string, options: ApiGetOptions = {}) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/vendors/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Vendor not found",
    ...options,
  });
}

export async function fetchProducts(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/products${toQuery(params)}`);
}

export async function fetchProductsByVendor(
  vendorId: string | number,
  params: QueryParams = {}
) {
  return apiGet<ApiListResponse>(
    `/products/vendor/${encodeURIComponent(String(vendorId))}${toQuery(params)}`
  );
}

export async function fetchProductBySlug(slug: string, options: ApiGetOptions = {}) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/products/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Product not found",
    ...options,
  });
}

export async function fetchCourses(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/courses${toQuery(params)}`);
}

export async function fetchSkillLevels(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/skill-levels${toQuery(params)}`);
}

export async function fetchCourseBySlug(slug: string, options: ApiGetOptions = {}) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/courses/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Course not found",
    ...options,
  });
}

export async function fetchIndustries(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/industries${toQuery(params)}`);
}

export async function fetchIndustryBySlug(slug: string, options: ApiGetOptions = {}) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/industries/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Industry not found",
    ...options,
  });
}

export async function fetchSkillingAreas(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/skilling-areas${toQuery(params)}`);
}

export async function fetchSkillingAreaBySlug(
  slug: string,
  options: ApiGetOptions = {}
) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/skilling-areas/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Skilling area not found",
    ...options,
  });
}

export async function fetchContents(
  params: QueryParams = {},
  options: ApiGetOptions = {}
) {
  return apiGet<ApiListResponse>(`/contents${toQuery(params)}`, options);
}

/** Fetch every active content row (paginates API limit of 100). */
export async function fetchAllContents(
  params: QueryParams = {},
  options: ApiGetOptions = {}
) {
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  const all: unknown[] = [];

  while (page <= totalPages) {
    const res = await fetchContents(
      { ...params, page, limit, status: "active" },
      options
    );
    const list = res as ApiListResponse;
    all.push(...(list.data || []));
    totalPages = list.totalPages || 1;
    page += 1;
  }

  return all;
}

/** Lookup by public path (`about-us` or `company/careers`). */
export async function fetchContentByPath(path: string, options: ApiGetOptions = {}) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/contents${toQuery({ path })}`, {
    notFoundMessage: "Content not found",
    ...options,
  });
}

export async function fetchBlogs(params: QueryParams = {}) {
  return apiGet<ApiListResponse>(`/blogs${toQuery(params)}`);
}

export async function fetchBlogBySlug(slug: string, options: ApiGetOptions = {}) {
  return apiGet<ApiItemResponse<Record<string, unknown>>>(`/blogs/${encodeURIComponent(slug)}`, {
    notFoundMessage: "Blog not found",
    ...options,
  });
}

export async function fetchSectionLibraryShowcase(
  showcaseKey: string,
  options: ApiGetOptions = {}
) {
  const key = showcaseKey || "index";
  return apiGet(`/section-library/showcase/${encodeURIComponent(key)}`, {
    notFoundMessage: "Section library showcase not found",
    ...options,
  });
}
