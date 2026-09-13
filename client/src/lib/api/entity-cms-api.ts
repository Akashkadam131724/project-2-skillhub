/**
 * CMS writes for catalog / skilling / content / blog entities.
 * Public reads live in `public.ts`. Page/section CMS lives in `cms-api.ts`.
 *
 * Prefer `entityCms.vendor.update(slug, body)` — flat `updateVendor` aliases remain.
 */
import { API } from "./routes";
import { apiRequest, toQuery } from "./client";
import type { ApiItemResponse, ApiListResponse, QueryParams } from "./types";

type Item = ApiItemResponse<Record<string, unknown>>;

type SlugRoutes = {
  root: string;
  one: (slug: string) => string;
  restore: (slug: string) => string;
};

function slugCms(routes: SlugRoutes) {
  return {
    create: (body: unknown) =>
      apiRequest<Item>(routes.root, { method: "POST", body }),
    update: (slug: string, body: unknown) =>
      apiRequest<Item>(routes.one(slug), { method: "PUT", body }),
    delete: (slug: string) => apiRequest(routes.one(slug), { method: "DELETE" }),
    restore: (slug: string) =>
      apiRequest(routes.restore(slug), { method: "POST" }),
  };
}

export const entityCms = {
  vendor: slugCms(API.catalog.vendors),
  product: slugCms(API.catalog.products),
  course: slugCms(API.catalog.courses),
  skillingArea: slugCms(API.skilling.areas),
  industry: slugCms(API.skilling.industries),
  content: slugCms(API.content),
  blog: slugCms(API.blog),
  skillLevel: {
    list: (params: QueryParams = {}) =>
      apiRequest<ApiListResponse>(
        `${API.skilling.levels.root}${toQuery(params)}`
      ),
  },
};

export const createVendor = entityCms.vendor.create;
export const updateVendor = entityCms.vendor.update;
export const deleteVendor = entityCms.vendor.delete;
export const restoreVendor = entityCms.vendor.restore;

export const createProduct = entityCms.product.create;
export const updateProduct = entityCms.product.update;
export const deleteProduct = entityCms.product.delete;
export const restoreProduct = entityCms.product.restore;

export const createCourse = entityCms.course.create;
export const updateCourse = entityCms.course.update;
export const deleteCourse = entityCms.course.delete;
export const restoreCourse = entityCms.course.restore;

export const createSkillingArea = entityCms.skillingArea.create;
export const updateSkillingArea = entityCms.skillingArea.update;
export const deleteSkillingArea = entityCms.skillingArea.delete;
export const restoreSkillingArea = entityCms.skillingArea.restore;

export const createIndustry = entityCms.industry.create;
export const updateIndustry = entityCms.industry.update;
export const deleteIndustry = entityCms.industry.delete;
export const restoreIndustry = entityCms.industry.restore;

export const createContent = entityCms.content.create;
export const updateContent = entityCms.content.update;
export const deleteContent = entityCms.content.delete;
export const restoreContent = entityCms.content.restore;

export const createBlog = entityCms.blog.create;
export const updateBlog = entityCms.blog.update;
export const deleteBlog = entityCms.blog.delete;
export const restoreBlog = entityCms.blog.restore;

export const listSkillLevels = entityCms.skillLevel.list;
