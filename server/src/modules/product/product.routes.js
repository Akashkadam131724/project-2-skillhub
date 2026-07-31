import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductsByVendor,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "./product.controllers.js";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/vendor/:vendorId", getProductsByVendor);
router.get("/:slug", getProductBySlug);
router.put("/:slug", updateProduct);
router.post("/:slug/restore", restoreProduct);
router.delete("/:slug", deleteProduct);

export default router;
