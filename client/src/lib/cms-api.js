import { logFetchResult } from "@/lib/cache-log";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request(path, { method = "GET", body, next, cache } = {}) {
  const init = {
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
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.fields = data.fields;
    err.payload = data;
    throw err;
  }
  return data;
}

/* ─── Pages ─── */
export function listPages(params) {
  return request(`/pages${toQuery(params)}`);
}

export function getPage(key) {
  return request(`/pages/${encodeURIComponent(key)}`);
}

export function getPageSectionsResolved(key, entityId, options = {}) {
  return request(
    `/pages/${encodeURIComponent(key)}/sections${toQuery({ entityId })}`,
    options
  );
}

export function createPage(body) {
  return request("/pages", { method: "POST", body });
}

export function updatePage(key, body) {
  return request(`/pages/${encodeURIComponent(key)}`, {
    method: "PUT",
    body,
  });
}

export function setPageStatus(key, status) {
  return request(`/pages/${encodeURIComponent(key)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deletePage(key) {
  return request(`/pages/${encodeURIComponent(key)}`, { method: "DELETE" });
}

/* ─── Sections ─── */
export function listSections(params) {
  return request(`/sections${toQuery(params)}`);
}

export function getSection(key) {
  return request(`/sections/${encodeURIComponent(key)}`);
}

export function createSection(body) {
  return request("/sections", { method: "POST", body });
}

export function updateSection(key, body) {
  return request(`/sections/${encodeURIComponent(key)}`, {
    method: "PUT",
    body,
  });
}

export function setSectionStatus(key, status) {
  return request(`/sections/${encodeURIComponent(key)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteSection(key) {
  return request(`/sections/${encodeURIComponent(key)}`, { method: "DELETE" });
}

export function setSectionPages(key, pages) {
  return request(`/sections/${encodeURIComponent(key)}/pages`, {
    method: "PUT",
    body: { pages },
  });
}

export function addSectionPageTag(sectionKey, pageKey, body = {}) {
  return request(
    `/sections/${encodeURIComponent(sectionKey)}/pages/${encodeURIComponent(pageKey)}`,
    { method: "POST", body }
  );
}

export function updateSectionPageTag(sectionKey, tagId, body) {
  return request(
    `/sections/${encodeURIComponent(sectionKey)}/pages/tag/${encodeURIComponent(tagId)}`,
    { method: "PUT", body }
  );
}

export function deleteSectionPageTag(sectionKey, tagId) {
  return request(
    `/sections/${encodeURIComponent(sectionKey)}/pages/tag/${encodeURIComponent(tagId)}`,
    { method: "DELETE" }
  );
}

/* ─── Page-section (flat tags + reorder) ─── */
export function listPageSections(params) {
  return request(`/page-sections${toQuery(params)}`);
}

export function tagSectionToPage(body) {
  return request("/page-sections", { method: "POST", body });
}

export function updatePageSectionTag(id, body) {
  return request(`/page-sections/${encodeURIComponent(id)}`, {
    method: "PUT",
    body,
  });
}

export function setPageSectionTagStatus(id, status) {
  return request(`/page-sections/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deletePageSectionTag(id) {
  return request(`/page-sections/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function reorderPageSections(page_key, items) {
  return request("/page-sections/reorder", {
    method: "PUT",
    body: { page_key, items },
  });
}

/* ─── Per-entity placement overrides ─── */
export function upsertEntityPageSection(body) {
  return request("/page-sections/entity", { method: "PUT", body });
}

export function getEntityPageSections({ page_key, entity_id }) {
  return request(
    `/page-sections/entity${toQuery({ page_key, entity_id })}`
  );
}

export function deleteEntityPageSection(id) {
  return request(`/page-sections/entity/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/** Resolve relative upload paths against the API host */
export function mediaUrl(src) {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const base = API_URL.replace(/\/$/, "");
  return src.startsWith("/") ? `${base}${src}` : `${base}/${src}`;
}

/** Upload a data-URL image; returns { url } (path like /uploads/sections/…) */
export async function uploadCmsImage(dataUrl, folder = "sections") {
  return request("/api/uploads", {
    method: "POST",
    body: { data_url: dataUrl, folder },
  });
}
