import { logFetchResult } from "@/lib/cache/cache-log";
import { apiGet } from "./client";
import { API } from "./routes";
import type {
  ApiGetOptions,
  ApiItemResponse,
  ApiListResponse,
  CmsApiError,
  CmsRequestOptions,
  QueryParams,
  ResolvedPageSectionsResponse,
  SectionCategoriesResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function toQuery(params: QueryParams = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request<T = unknown>(
  path: string,
  { method = "GET", body, next, cache }: CmsRequestOptions = {}
): Promise<T> {
  const init: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  };
  if (next) init.next = next;
  else if (cache) init.cache = cache;
  else init.cache = "no-store";

  const res = await fetch(`${API_URL}${path}`, init);
  if (method === "GET") {
    logFetchResult(`cms ${method} ${path}`, res, init);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      (data as { message?: string }).message || "Request failed"
    ) as CmsApiError;
    err.status = res.status;
    err.fields = (data as { fields?: unknown }).fields;
    err.payload = data;
    throw err;
  }
  return data as T;
}

/* ─── Pages ─── */
export function listPages(params?: QueryParams) {
  return request<ApiListResponse>(`${API.cms.pages.root}${toQuery(params)}`);
}

export function getPage(key: string) {
  return request<ApiItemResponse<Record<string, unknown>>>(API.cms.pages.one(key));
}

export function getPageSectionsResolved(
  key: string,
  entityId?: string | number | null,
  options: CmsRequestOptions & { view?: string } = {}
) {
  const { view = "public", ...requestOptions } = options;
  const query: QueryParams = { entityId };
  // view=cms|full → full resolve payload for admin tools
  if (view && view !== "cms" && view !== "full") {
    query.view = view;
  }

  return request<ResolvedPageSectionsResponse>(
    `${API.cms.pages.sections(key)}${toQuery(query)}`,
    requestOptions
  );
}

export function createPage(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(API.cms.pages.root, {
    method: "POST",
    body,
  });
}

export function updatePage(key: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(API.cms.pages.one(key), {
    method: "PUT",
    body,
  });
}

export function setPageStatus(key: string, status: unknown) {
  return request(API.cms.pages.status(key), {
    method: "PATCH",
    body: { status },
  });
}

export function deletePage(key: string) {
  return request(API.cms.pages.one(key), { method: "DELETE" });
}

/* ─── Site theme ─── */
export function getSiteTheme(options: CmsRequestOptions = {}) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    API.cms.siteTheme.root,
    options
  );
}

export function updateSiteTheme(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(API.cms.siteTheme.root, {
    method: "PUT",
    body,
  });
}

/* ─── Entity page theme (this page only) ─── */
export function getEntityPageTheme({
  page_key,
  entity_id,
}: {
  page_key: string;
  entity_id: string | number;
}) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `${API.cms.entityPageTheme.root}${toQuery({ page_key, entity_id })}`
  );
}

export function upsertEntityPageTheme(body: unknown) {
  return request(API.cms.entityPageTheme.root, { method: "PUT", body });
}

export function deleteEntityPageTheme({
  page_key,
  entity_id,
}: {
  page_key: string;
  entity_id: string | number;
}) {
  return request(
    `${API.cms.entityPageTheme.root}${toQuery({ page_key, entity_id })}`,
    { method: "DELETE" }
  );
}

/* ─── Section categories ─── */
export function listSectionCategories(params?: QueryParams) {
  return request<SectionCategoriesResponse>(
    `${API.cms.sectionCategories.root}${toQuery(params)}`
  );
}

export function getSectionCategory(key: string) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    API.cms.sectionCategories.one(key)
  );
}

/* ─── Sections ─── */
export function listSections(params?: QueryParams) {
  return request<ApiListResponse<Record<string, unknown>>>(
    `${API.cms.sections.root}${toQuery(params)}`
  );
}

export function getSection(key: string) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    API.cms.sections.one(key)
  );
}

export function createSection(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(API.cms.sections.root, {
    method: "POST",
    body,
  });
}

export function updateSection(key: string, body: unknown) {
  return request(API.cms.sections.one(key), {
    method: "PUT",
    body,
  });
}

export function setSectionStatus(key: string, status: unknown) {
  return request(API.cms.sections.status(key), {
    method: "PATCH",
    body: { status },
  });
}

export function deleteSection(key: string) {
  return request(API.cms.sections.one(key), { method: "DELETE" });
}

export function setSectionPages(key: string, pages: unknown) {
  return request(API.cms.sections.pages(key), {
    method: "PUT",
    body: { pages },
  });
}

export function addSectionPageTag(
  sectionKey: string,
  pageKey: string,
  body: Record<string, unknown> = {}
) {
  return request(API.cms.sections.pageTag(sectionKey, pageKey), {
    method: "POST",
    body,
  });
}

export function updateSectionPageTag(
  sectionKey: string,
  tagId: string,
  body: unknown
) {
  return request(API.cms.sections.tag(sectionKey, tagId), {
    method: "PUT",
    body,
  });
}

export function deleteSectionPageTag(sectionKey: string, tagId: string) {
  return request(API.cms.sections.tag(sectionKey, tagId), {
    method: "DELETE",
  });
}

/* ─── Page-section (flat tags + reorder) ─── */
export function listPageSections(params?: QueryParams) {
  return request<ApiListResponse<Record<string, unknown>>>(
    `${API.cms.pageSections.root}${toQuery(params)}`
  );
}

export function tagSectionToPage(body: unknown) {
  return request(API.cms.pageSections.root, { method: "POST", body });
}

export function updatePageSectionTag(id: string, body: unknown) {
  return request(API.cms.pageSections.one(id), {
    method: "PUT",
    body,
  });
}

export function setPageSectionTagStatus(id: string, status: unknown) {
  return request(API.cms.pageSections.status(id), {
    method: "PATCH",
    body: { status },
  });
}

export function deletePageSectionTag(id: string) {
  return request(API.cms.pageSections.one(id), {
    method: "DELETE",
  });
}

export function reorderPageSections(page_key: string, items: unknown) {
  return request(API.cms.pageSections.reorder, {
    method: "PUT",
    body: { page_key, items },
  });
}

/* ─── Per-entity placement overrides ─── */
export function upsertEntityPageSection(body: unknown) {
  return request(API.cms.pageSections.entity, { method: "PUT", body });
}

/** Create page-only section placements for a content entity (in order). */
export async function createContentPageSections(
  pageKey: string,
  entityId: string | number,
  sectionKeys: string[]
) {
  const keys = Array.isArray(sectionKeys) ? sectionKeys : [];
  const results: unknown[] = [];
  for (let i = 0; i < keys.length; i += 1) {
    const section_key = String(keys[i] || "").trim();
    if (!section_key) continue;
    const res = await upsertEntityPageSection({
      page_key: pageKey,
      entity_id: entityId,
      section_key,
      sort_order: i,
      status: true,
    });
    results.push(res);
  }
  return results;
}

export function getEntityPageSections({
  page_key,
  entity_id,
}: {
  page_key: string;
  entity_id: string | number;
}) {
  return request<ApiListResponse<Record<string, unknown>>>(
    `${API.cms.pageSections.entity}${toQuery({ page_key, entity_id })}`
  );
}

export function deleteEntityPageSection(id: string) {
  return request(API.cms.pageSections.entityOne(id), {
    method: "DELETE",
  });
}

/** Resolve relative upload paths against the API host */
export function mediaUrl(src?: string | null) {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const base = API_URL.replace(/\/$/, "");
  return src.startsWith("/") ? `${base}${src}` : `${base}/${src}`;
}

/** Upload a data-URL image; returns { data: { url, path } } */
export async function uploadCmsImage(dataUrl: string, folder = "sections") {
  return request<ApiItemResponse<{ url: string; path?: string }>>(
    API.site.uploads.api,
    {
      method: "POST",
      body: { data_url: dataUrl, folder },
    }
  );
}

export async function fetchSectionLibraryShowcase(
  showcaseKey: string,
  options: ApiGetOptions = {}
) {
  const key = showcaseKey || "index";
  return apiGet(API.cms.sectionLibrary.showcaseOne(key), {
    notFoundMessage: "Section library showcase not found",
    ...options,
  });
}
