import { Router } from "express";
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  getCoursesByProduct,
  updateCourse,
  deleteCourse,
  restoreCourse,
} from "./course.controllers.js";
import {
  catalogCourses,
  getCatalogFilters,
} from "./course.filter.controller.js";

const router = Router();

router.post("/", createCourse);
router.get("/", getCourses);

// Catalog filter APIs — must be before /:slug
router.get("/catalog", catalogCourses);
router.get("/catalog/filters", getCatalogFilters);

router.get("/product/:productId", getCoursesByProduct);
router.get("/:slug", getCourseBySlug);
router.put("/:slug", updateCourse);
router.post("/:slug/restore", restoreCourse);
router.delete("/:slug", deleteCourse);

export default router;
