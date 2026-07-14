import { Router } from "express";
import {
  createSection,
  getSections,
  getSectionByKey,
  updateSection,
  setSectionStatus,
  setSectionPages,
  tagSectionPage,
  updateSectionPageTag,
  untagSectionPageById,
  untagSectionPage,
  deleteSection,
} from "./section.controllers.js";

const router = Router();

router.post("/", createSection);
router.get("/", getSections);

router.put("/:key/pages", setSectionPages);
// Always adds a new placement (same page allowed twice+)
router.post("/:key/pages/:pageKey", tagSectionPage);
// Edit / remove a specific placement by tag id
router.put("/:key/pages/tag/:tagId", updateSectionPageTag);
router.delete("/:key/pages/tag/:tagId", untagSectionPageById);
// Remove ALL placements for a page_key
router.delete("/:key/pages/by-page/:pageKey", untagSectionPage);

router.get("/:key", getSectionByKey);
router.put("/:key", updateSection);
router.patch("/:key/status", setSectionStatus);
router.delete("/:key", deleteSection);

export default router;
