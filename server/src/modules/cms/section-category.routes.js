import { Router } from "express";
import {
  getSectionCategoryByKey,
  listSectionCategories,
} from "./section-category.controllers.js";

const router = Router();

router.get("/", listSectionCategories);
router.get("/:key", getSectionCategoryByKey);

export default router;
