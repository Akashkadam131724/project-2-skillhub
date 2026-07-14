import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductsByVendor,
  updateProduct,
  deleteProduct,
} from "./product.controllers.js";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/vendor/:vendorId", getProductsByVendor);
router.get("/:slug", getProductBySlug);
router.put("/:slug", updateProduct);
router.delete("/:slug", deleteProduct);

export default router;
