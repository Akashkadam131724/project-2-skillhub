import { Router } from "express";
import {
  getNavigation,
  createNavigation,
  updateNavigation,
  getNavigationColumns,
  createNavigationColumn,
  createNavLink,
  filterNavigation,
} from "./navigation.controllers.js";

const router = Router();

router.get("/", getNavigation);
router.get("/filter", filterNavigation);
router.post("/", createNavigation);
router.get("/columns", getNavigationColumns);
router.post("/columns", createNavigationColumn);
router.post("/column/links", createNavLink);
router.put("/:id", updateNavigation);

export default router;
