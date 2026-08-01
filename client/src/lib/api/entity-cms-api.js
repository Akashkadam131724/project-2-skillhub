/**
 * Entity CMS API — create / update / delete for catalog entities.
 * Reads can use @/lib/api fetch* helpers.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
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

function enc(slug) {
  return encodeURIComponent(slug);
}

/* Vendors */
export function createVendor(body) {
  return request("/vendors", { method: "POST", body });
}
export function updateVendor(slug, body) {
  return request(`/vendors/${enc(slug)}`, { method: "PUT", body });
}
export function deleteVendor(slug) {
  return request(`/vendors/${enc(slug)}`, { method: "DELETE" });
}
export function restoreVendor(slug) {
  return request(`/vendors/${enc(slug)}/restore`, { method: "POST" });
}

/* Products */
export function createProduct(body) {
  return request("/products", { method: "POST", body });
}
export function updateProduct(slug, body) {
  return request(`/products/${enc(slug)}`, { method: "PUT", body });
}
export function deleteProduct(slug) {
  return request(`/products/${enc(slug)}`, { method: "DELETE" });
}
export function restoreProduct(slug) {
  return request(`/products/${enc(slug)}/restore`, { method: "POST" });
}

/* Courses */
export function createCourse(body) {
  return request("/courses", { method: "POST", body });
}
export function updateCourse(slug, body) {
  return request(`/courses/${enc(slug)}`, { method: "PUT", body });
}
export function deleteCourse(slug) {
  return request(`/courses/${enc(slug)}`, { method: "DELETE" });
}
export function restoreCourse(slug) {
  return request(`/courses/${enc(slug)}/restore`, { method: "POST" });
}

/* Industries */
export function createIndustry(body) {
  return request("/industries", { method: "POST", body });
}
export function updateIndustry(slug, body) {
  return request(`/industries/${enc(slug)}`, { method: "PUT", body });
}
export function deleteIndustry(slug) {
  return request(`/industries/${enc(slug)}`, { method: "DELETE" });
}
export function restoreIndustry(slug) {
  return request(`/industries/${enc(slug)}/restore`, { method: "POST" });
}

/* Skilling areas */
export function createSkillingArea(body) {
  return request("/skilling-areas", { method: "POST", body });
}
export function updateSkillingArea(slug, body) {
  return request(`/skilling-areas/${enc(slug)}`, { method: "PUT", body });
}
export function deleteSkillingArea(slug) {
  return request(`/skilling-areas/${enc(slug)}`, { method: "DELETE" });
}
export function restoreSkillingArea(slug) {
  return request(`/skilling-areas/${enc(slug)}/restore`, { method: "POST" });
}

/* Content pages (about-us, our-team, …) */
export function createContent(body) {
  return request("/contents", { method: "POST", body });
}
export function updateContent(slug, body) {
  return request(`/contents/${enc(slug)}`, { method: "PUT", body });
}
export function deleteContent(slug) {
  return request(`/contents/${enc(slug)}`, { method: "DELETE" });
}
export function restoreContent(slug) {
  return request(`/contents/${enc(slug)}/restore`, { method: "POST" });
}

/* Blogs */
export function createBlog(body) {
  return request("/blogs", { method: "POST", body });
}
export function updateBlog(slug, body) {
  return request(`/blogs/${enc(slug)}`, { method: "PUT", body });
}
export function deleteBlog(slug) {
  return request(`/blogs/${enc(slug)}`, { method: "DELETE" });
}
export function restoreBlog(slug) {
  return request(`/blogs/${enc(slug)}/restore`, { method: "POST" });
}

/* Skill levels (for course form) */
export function listSkillLevels(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const q = qs.toString();
  return request(`/skill-levels${q ? `?${q}` : ""}`);
}
