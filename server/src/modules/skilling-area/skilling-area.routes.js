import { Router } from "express";
import {
  createSkillingArea,
  getSkillingAreas,
  getSkillingAreaBySlug,
  getCoursesBySkillingArea,
  updateSkillingArea,
  deleteSkillingArea,
  restoreSkillingArea,
  mapCourseSkillingAreas,
} from "./skilling-area.controllers.js";

const router = Router();

router.post("/", createSkillingArea);
router.get("/", getSkillingAreas);
router.put("/map/course/:courseId", mapCourseSkillingAreas);
router.get("/:idOrSlug/courses", getCoursesBySkillingArea);
router.get("/:slug", getSkillingAreaBySlug);
router.put("/:slug", updateSkillingArea);
router.post("/:slug/restore", restoreSkillingArea);
router.delete("/:slug", deleteSkillingArea);

export default router;
