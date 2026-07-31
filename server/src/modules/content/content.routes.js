import { Router } from "express";
import {
  createContent,
  getContents,
  getContentBySlug,
  updateContent,
  deleteContent,
  restoreContent,
} from "./content.controllers.js";

const router = Router();

router.post("/", createContent);
router.get("/", getContents);
router.get("/:slug", getContentBySlug);
router.put("/:slug", updateContent);
router.post("/:slug/restore", restoreContent);
router.delete("/:slug", deleteContent);

export default router;
