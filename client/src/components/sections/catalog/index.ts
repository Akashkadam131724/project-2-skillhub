/**
 * Catalog category
 *
 * Layout per variant:
 *   <variant>/
 *     Ui.tsx | Static.tsx | PublicSection.tsx | Section.tsx  (item-list sections)
 *     Ui.tsx | Client.tsx | PublicSection.tsx | Section.tsx  (API / directory sections)
 *     lib/          — variant-only (cms-config, map, placement, static-demo)
 *
 *   shared/         — category-wide UI (CatalogPager, CatalogSearch, CourseCard, …)
 *   shared/lib/     — category-wide helpers (catalogBaseParamsFromContext, CatalogPageContext)
 *
 * CMS registry: client/src/lib/sections/configs/index.js (item-list variants only)
 */
export {
  RelatedCoursesSection,
  RelatedCoursesPublicSection,
  RelatedCoursesUi,
} from "./related-courses";
export {
  CurriculumSection,
  CurriculumPublicSection,
  CurriculumStatic,
  CurriculumUi,
} from "./curriculum";
export {
  ResourcesSection,
  ResourcesPublicSection,
  ResourcesStatic,
  ResourcesUi,
} from "./resources";
export {
  ProductsSection,
  ProductsPublicSection,
  ProductsUi,
} from "./products";
export {
  CourseCatalogSection,
  CourseCatalogPublicSection,
  CourseCatalogUi,
  CatalogSection,
} from "./course-catalog";
export {
  EntityDirectorySection,
  EntityDirectoryPublicSection,
  EntityDirectoryUi,
} from "./entity-directory";
export {
  BlogDirectorySection,
  BlogDirectoryPublicSection,
  BlogDirectoryUi,
} from "./blog-directory";
export {
  catalogBaseParamsFromContext,
  catalogHideKeysFromContext,
} from "./shared/lib/context";
export type { CatalogPageContext } from "./shared/lib/types";
