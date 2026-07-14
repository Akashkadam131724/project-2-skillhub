import { Router } from "express";
import {
  createContent,
  getContents,
  getContentBySlug,
  updateContent,
  deleteContent,
} from "./content.controllers.js";

const router = Router();

router.post("/", createContent);
router.get("/", getContents);
router.get("/:slug", getContentBySlug);
router.put("/:slug", updateContent);
router.delete("/:slug", deleteContent);

export default router;
