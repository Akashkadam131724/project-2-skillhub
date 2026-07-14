import { Router } from "express";
import {
  createSkillLevel,
  getSkillLevels,
  getSkillLevelBySlug,
  getCoursesBySkillLevel,
  updateSkillLevel,
  deleteSkillLevel,
} from "./skill-level.controllers.js";

const router = Router();

router.post("/", createSkillLevel);
router.get("/", getSkillLevels);
router.get("/:idOrSlug/courses", getCoursesBySkillLevel);
router.get("/:slug", getSkillLevelBySlug);
router.put("/:slug", updateSkillLevel);
router.delete("/:slug", deleteSkillLevel);

export default router;
