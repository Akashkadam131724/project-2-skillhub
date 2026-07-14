import { Router } from "express";
import {
  tagSectionToPage,
  getPageSections,
  updatePageSection,
  setPageSectionStatus,
  reorderPageSections,
  deletePageSection,
  upsertEntityPageSection,
  getEntityPageSections,
  deleteEntityPageSection,
} from "./page-section.controllers.js";

const router = Router();

// Template tagging
router.post("/", tagSectionToPage);
router.get("/", getPageSections);
router.put("/reorder", reorderPageSections);

// Per-entity overrides (before /:id routes)
router.put("/entity", upsertEntityPageSection);
router.get("/entity", getEntityPageSections);
router.delete("/entity/:id", deleteEntityPageSection);

router.put("/:id", updatePageSection);
router.patch("/:id/status", setPageSectionStatus);
router.delete("/:id", deletePageSection);

export default router;
