import { Router } from "express";
import {
  getSectionLibraryCategories,
  getSectionLibraryShowcase,
} from "./section-library.controllers.js";

const router = Router();

router.get("/categories", getSectionLibraryCategories);
router.get("/showcase/:showcaseKey", getSectionLibraryShowcase);
router.get("/showcase", getSectionLibraryShowcase);

export default router;
