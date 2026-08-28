/**
 * catalog (course catalog) — Ui / Public / Cms
 */
export { default as CourseCatalogUi } from "./CourseCatalogUi";
export { default as CourseCatalogPublicSection } from "./CourseCatalogPublicSection";
export { default as CourseCatalogSection } from "./CourseCatalogSection";
/** @deprecated Use CourseCatalogSection */
export { default as CatalogSection } from "./CourseCatalogSection";
export {
  resolveCourseCatalogSubtitle,
  resolveCourseCatalogTitle,
} from "./lib";
