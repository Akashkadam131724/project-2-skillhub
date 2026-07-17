import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogs,
  updateBlog,
} from "./blog.controllers.js";

const router = Router();

router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.put("/:slug", updateBlog);
router.delete("/:slug", deleteBlog);

export default router;
