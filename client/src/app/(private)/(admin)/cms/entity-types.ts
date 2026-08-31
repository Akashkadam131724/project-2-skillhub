import type { CmsEntityListItem } from "@/components/cms/admin/types";
import type { BlogSummary } from "@/lib/types/blog";

/** Loose API row — entity CMS pages coerce fields as needed */
export type ApiRecord = Record<string, unknown>;

export type SlugEntity = CmsEntityListItem & {
  slug: string;
  name: string;
};

export type VendorListItem = SlugEntity & {
  email?: string;
};

export type VendorCreateForm = {
  name: string;
  email: string;
  phone: string;
  status: string;
  shortDescription: string;
  description: string;
  logoUrl: string;
};

export type VendorEditForm = VendorCreateForm & {
  overviewTitle: string;
  overview: string;
  vendorCatalogueLogo: string;
};

export type VendorRecord = VendorListItem & {
  phone?: string;
  shortDescription?: string;
  description?: string;
  overviewTitle?: string;
  overview?: string;
  logoUrl?: string;
  vendorCatalogueLogo?: string;
};

export type IndustryListItem = SlugEntity & {
  description?: string;
  sortOrder?: number;
};

export type IndustryForm = {
  name: string;
  description: string;
  status: string;
  sortOrder: number;
};

export type SkillingAreaListItem = SlugEntity & {
  description?: string;
  sortOrder?: number;
};

export type SkillingAreaForm = IndustryForm;

export type ProductListItem = SlugEntity & {
  category?: string;
  vendor?: ApiRecord | string;
};

export type ProductCreateForm = {
  name: string;
  vendor: string;
  description: string;
  category: string;
  status: string;
};

export type ProductEditForm = ProductCreateForm;

export type ProductRecord = ProductListItem & {
  description?: string;
};

export type CourseListItem = SlugEntity & {
  product?: ApiRecord | string;
  readingTime?: number;
};

export type CourseCreateForm = {
  name: string;
  product: string;
  description: string;
  status: string;
  skillLevel: string;
  industries: string[];
  skillingAreas: string[];
};

export type CourseEditForm = CourseCreateForm;

export type CourseRecord = CourseListItem & {
  description?: string;
  skillLevel?: ApiRecord | string;
  industries?: Array<ApiRecord | string>;
  skillingAreas?: Array<ApiRecord | string>;
};

export type BlogListItem = CmsEntityListItem & {
  slug: string;
  title: string;
  category?: string;
  readingTime?: number;
};

export type BlogCreateForm = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorName: string;
  featuredImage: string;
  status: string;
};

export type BlogEditForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  featuredImage: string;
  imageAlt: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  status: string;
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
};

export type BlogRecord = BlogSummary & ApiRecord;

export type SelectOption = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
};

export function idFromRef(value: unknown): string {
  if (!value) return "";
  if (typeof value === "object") {
    const row = value as ApiRecord;
    return String(row._id || row.id || "");
  }
  return String(value);
}

export function idsFromRefs(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => idFromRef(x));
}

export function vendorIdFromProduct(data: ApiRecord): string {
  return idFromRef(data.vendor);
}

export type PageTemplateForm = {
  key: string;
  name: string;
  description: string;
  entity_type: string;
  status: boolean;
  is_sort_disabled: boolean;
};

export type PageTemplateRecord = {
  key: string;
  name: string;
  description?: string;
  entity_type?: string | null;
  status?: boolean;
  is_sort_disabled?: boolean;
};

export type PagePlacementTag = ApiRecord & {
  id?: string | number;
  section_key?: string;
  sort_order?: number;
  status?: boolean;
  content_scope?: string;
};

export type ContentPageForm = {
  name: string;
  path: string;
  description: string;
  status: string;
};

export type ContentPageListItem = CmsEntityListItem & {
  slug: string;
  name: string;
  path?: string;
  description?: string;
};

export type ContentFormMode = "new" | "edit" | null;

export type SectionMetaForm = {
  name: string;
  description: string;
  category: string;
  content_scope: string;
  section_preview_img: string;
  section_theme: string;
};

export type SectionCatalogDoc = ApiRecord & {
  key: string;
  name?: string;
  status?: boolean;
  content_scope?: string;
  category?: string;
  category_key?: string;
  section_title?: string;
  render_key?: string;
  pages?: Array<{ page_key?: string }>;
};

export type PageDetailForm = {
  name: string;
  description: string;
  entity_type: string;
  status: boolean;
  is_sort_disabled: boolean;
};

export type PlacementForm = {
  section_key: string;
  sort_order: number;
  section_title: string;
  sub_title: string;
  in_page_nav_title: string;
  section_bg_img: string;
  section_img_url: string;
  status: boolean;
};

export type SectionCategoryOption = {
  key: string;
  name?: string;
};
