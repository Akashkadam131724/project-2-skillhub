import { Router } from "express";
import { getSiteTheme, updateSiteTheme } from "./site-theme.controllers.js";

const router = Router();

router.get("/", getSiteTheme);
router.put("/", updateSiteTheme);

export default router;
