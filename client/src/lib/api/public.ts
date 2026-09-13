/**
 * Public / read helpers — used on the site and CMS list screens.
 * Writes live in `entityCms`; page/section CMS in `cms-api.ts`.
 *
 * Prefer `publicApi.vendor.bySlug(slug)` — flat `fetchVendorBySlug` aliases remain.
 */
import { API } from "./routes";
import { apiGet, toQuery } from "./client";
import type {
  ApiGetOptions,
  ApiItemResponse,
  ApiListResponse,
  QueryParams,
} from "./types";

type Item = ApiItemResponse<Record<string, unknown>>;
type List = ApiListResponse;

type SlugRoutes = {
  root: string;
  one: (slug: string) => string;
};

function slugPublic(routes: SlugRoutes, notFoundMessage: string) {
  return {
    list: (params: QueryParams = {}, options: ApiGetOptions = {}) =>
      apiGet<List>(`${routes.root}${toQuery(params)}`, options),
    bySlug: (slug: string, options: ApiGetOptions = {}) =>
      apiGet<Item>(routes.one(slug), { notFoundMessage, ...options }),
  };
}

const vendor = slugPublic(API.catalog.vendors, "Vendor not found");
const productBase = slugPublic(API.catalog.products, "Product not found");
const courseBase = slugPublic(API.catalog.courses, "Course not found");
const skillingArea = slugPublic(API.skilling.areas, "Skilling area not found");
const industry = slugPublic(API.skilling.industries, "Industry not found");
const contentBase = slugPublic(API.content, "Content not found");
const blog = slugPublic(API.blog, "Blog not found");

export const publicApi = {
  search: {
    global: ({ q, limit = 6 }: { q?: string; limit?: number } = {}) =>
      apiGet(`${API.site.search.root}${toQuery({ q, limit })}`),
  },
  vendor,
  product: {
    ...productBase,
    byVendor: (vendorId: string | number, params: QueryParams = {}) =>
      apiGet<List>(
        `${API.catalog.products.byVendor(vendorId)}${toQuery(params)}`
      ),
  },
  course: {
    ...courseBase,
    catalog: (params: QueryParams = {}) =>
      apiGet<ApiListResponse<Record<string, unknown>>>(
        `${API.catalog.courses.catalog}${toQuery(params)}`
      ),
    catalogFilters: (params: QueryParams = {}) =>
      apiGet(`${API.catalog.courses.catalogFilters}${toQuery(params)}`),
  },
  skillingArea,
  skillLevel: {
    list: (params: QueryParams = {}) =>
      apiGet<List>(`${API.skilling.levels.root}${toQuery(params)}`),
  },
  industry,
  content: {
    ...contentBase,
    all: async (params: QueryParams = {}, options: ApiGetOptions = {}) => {
      const limit = 100;
      let page = 1;
      let totalPages = 1;
      const all: unknown[] = [];
      while (page <= totalPages) {
        const res = await contentBase.list(
          { ...params, page, limit, status: "active" },
          options
        );
        all.push(...(res.data || []));
        totalPages = res.totalPages || 1;
        page += 1;
      }
      return all;
    },
    byPath: (path: string, options: ApiGetOptions = {}) =>
      apiGet<Item>(`${API.content.root}${toQuery({ path })}`, {
        notFoundMessage: "Content not found",
        ...options,
      }),
  },
  blog,
};

export const fetchGlobalSearch = publicApi.search.global;
export const fetchVendors = publicApi.vendor.list;
export const fetchVendorBySlug = publicApi.vendor.bySlug;
export const fetchProducts = publicApi.product.list;
export const fetchProductsByVendor = publicApi.product.byVendor;
export const fetchProductBySlug = publicApi.product.bySlug;
export const fetchCatalog = publicApi.course.catalog;
export const fetchCatalogFilters = publicApi.course.catalogFilters;
export const fetchCourses = publicApi.course.list;
export const fetchCourseBySlug = publicApi.course.bySlug;
export const fetchSkillingAreas = publicApi.skillingArea.list;
export const fetchSkillingAreaBySlug = publicApi.skillingArea.bySlug;
export const fetchSkillLevels = publicApi.skillLevel.list;
export const fetchIndustries = publicApi.industry.list;
export const fetchIndustryBySlug = publicApi.industry.bySlug;
export const fetchContents = publicApi.content.list;
export const fetchAllContents = publicApi.content.all;
export const fetchContentByPath = publicApi.content.byPath;
export const fetchBlogs = publicApi.blog.list;
export const fetchBlogBySlug = publicApi.blog.bySlug;
