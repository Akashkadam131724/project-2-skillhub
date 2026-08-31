/**
 * Entity CMS API — create / update / delete for catalog entities.
 * Reads can use @/lib/api fetch* helpers.
 */
import type { ApiItemResponse, ApiListResponse, CmsApiError, QueryParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function request<T = unknown>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
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

function enc(slug: string) {
  return encodeURIComponent(slug);
}

/* Vendors */
export function createVendor(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/vendors", {
    method: "POST",
    body,
  });
}
export function updateVendor(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/vendors/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteVendor(slug: string) {
  return request(`/vendors/${enc(slug)}`, { method: "DELETE" });
}
export function restoreVendor(slug: string) {
  return request(`/vendors/${enc(slug)}/restore`, { method: "POST" });
}

/* Products */
export function createProduct(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/products", {
    method: "POST",
    body,
  });
}
export function updateProduct(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/products/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteProduct(slug: string) {
  return request(`/products/${enc(slug)}`, { method: "DELETE" });
}
export function restoreProduct(slug: string) {
  return request(`/products/${enc(slug)}/restore`, { method: "POST" });
}

/* Courses */
export function createCourse(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/courses", {
    method: "POST",
    body,
  });
}
export function updateCourse(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/courses/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteCourse(slug: string) {
  return request(`/courses/${enc(slug)}`, { method: "DELETE" });
}
export function restoreCourse(slug: string) {
  return request(`/courses/${enc(slug)}/restore`, { method: "POST" });
}

/* Industries */
export function createIndustry(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/industries", {
    method: "POST",
    body,
  });
}
export function updateIndustry(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/industries/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteIndustry(slug: string) {
  return request(`/industries/${enc(slug)}`, { method: "DELETE" });
}
export function restoreIndustry(slug: string) {
  return request(`/industries/${enc(slug)}/restore`, { method: "POST" });
}

/* Skilling areas */
export function createSkillingArea(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/skilling-areas", {
    method: "POST",
    body,
  });
}
export function updateSkillingArea(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/skilling-areas/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteSkillingArea(slug: string) {
  return request(`/skilling-areas/${enc(slug)}`, { method: "DELETE" });
}
export function restoreSkillingArea(slug: string) {
  return request(`/skilling-areas/${enc(slug)}/restore`, { method: "POST" });
}

/* Content pages (about-us, our-team, …) */
export function createContent(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/contents", {
    method: "POST",
    body,
  });
}
export function updateContent(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/contents/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteContent(slug: string) {
  return request(`/contents/${enc(slug)}`, { method: "DELETE" });
}
export function restoreContent(slug: string) {
  return request(`/contents/${enc(slug)}/restore`, { method: "POST" });
}

/* Blogs */
export function createBlog(body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>("/blogs", {
    method: "POST",
    body,
  });
}
export function updateBlog(slug: string, body: unknown) {
  return request<ApiItemResponse<Record<string, unknown>>>(
    `/blogs/${enc(slug)}`,
    { method: "PUT", body }
  );
}
export function deleteBlog(slug: string) {
  return request(`/blogs/${enc(slug)}`, { method: "DELETE" });
}
export function restoreBlog(slug: string) {
  return request(`/blogs/${enc(slug)}/restore`, { method: "POST" });
}

/* Skill levels (for course form) */
export function listSkillLevels(params: QueryParams = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const q = qs.toString();
  return request<ApiListResponse>(`/skill-levels${q ? `?${q}` : ""}`);
}
