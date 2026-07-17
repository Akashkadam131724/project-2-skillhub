import { Router } from "express";
import {
  getEntityPageTheme,
  upsertEntityPageTheme,
  deleteEntityPageTheme,
} from "./entity-page-theme.controllers.js";

const router = Router();

router.get("/", getEntityPageTheme);
router.put("/", upsertEntityPageTheme);
router.delete("/", deleteEntityPageTheme);

export default router;
