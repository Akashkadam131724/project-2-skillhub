import { Router } from "express";
import {
  createPage,
  getPages,
  getPageByKey,
  updatePage,
  setPageStatus,
  deletePage,
  getResolvedSections,
} from "./page.controllers.js";

const router = Router();

router.post("/", createPage);
router.get("/", getPages);
router.get("/:key/sections", getResolvedSections);
router.get("/:key", getPageByKey);
router.put("/:key", updatePage);
router.patch("/:key/status", setPageStatus);
router.delete("/:key", deletePage);

export default router;
