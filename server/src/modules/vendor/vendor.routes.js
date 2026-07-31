import { Router } from "express";
import {
  createVendor,
  getvendors,
  getVendorBySlug,
  updateVendor,
  deleteVendor,
  restoreVendor,
  searchVendors,
} from "./vendor.controllers.js";

const router = Router();

router.post("/", createVendor);
router.get("/", getvendors);
router.get("/search/filters", searchVendors);
router.get("/:slug", getVendorBySlug);
router.put("/:slug", updateVendor);
router.post("/:slug/restore", restoreVendor);
router.delete("/:slug", deleteVendor);
export default router;