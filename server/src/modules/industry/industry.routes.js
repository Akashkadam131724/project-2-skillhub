import { Router } from "express";
import {
  createIndustry,
  getIndustries,
  getIndustryBySlug,
  getCoursesByIndustry,
  updateIndustry,
  deleteIndustry,
  mapCourseIndustries,
} from "./industry.controllers.js";

const router = Router();

router.post("/", createIndustry);
router.get("/", getIndustries);
router.put("/map/course/:courseId", mapCourseIndustries);
router.get("/:idOrSlug/courses", getCoursesByIndustry);
router.get("/:slug", getIndustryBySlug);
router.put("/:slug", updateIndustry);
router.delete("/:slug", deleteIndustry);

export default router;
