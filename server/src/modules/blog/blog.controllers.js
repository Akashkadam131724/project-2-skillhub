import Blog from "./blog.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";
import { createSoftDeleteController } from "../../utils/softDelete.controller.js";
import {
  buildTextSearchFilter,
  paginatedCmsList,
} from "../../utils/cmsList.js";

const softDelete = createSoftDeleteController({ Model: Blog, label: "Blog" });

function normalizeTags(value) {
  const values = Array.isArray(value)
    ? value
    : String(value || "").split(",");
  return [...new Set(values.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
}

function estimateReadingTime(content) {
  const words = String(content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizedBody(body = {}, { updating = false } = {}) {
  const next = { ...body };
  if ("tags" in next) next.tags = normalizeTags(next.tags);
  if ("content" in next) next.readingTime = estimateReadingTime(next.content);
  if (
    next.status === "active" &&
    !next.publishedAt &&
    (!updating || "status" in next)
  ) {
    next.publishedAt = new Date();
  }
  return next;
}

export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(normalizedBody(req.body));
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getBlogs = async (req, res) => {
  try {
    const sort =
      req.query.sort === "oldest"
        ? { publishedAt: 1, createdAt: 1 }
        : { featured: -1, publishedAt: -1, createdAt: -1 };

    await paginatedCmsList(req, res, {
      Model: Blog,
      defaultLimit: 12,
      sort,
      buildFilter(req) {
        const filter = {};
        if (req.query.category) {
          filter.category = String(req.query.category).trim().toLowerCase();
        }
        if (req.query.tag) {
          filter.tags = String(req.query.tag).trim().toLowerCase();
        }
        if (req.query.featured !== undefined) {
          filter.featured = String(req.query.featured) === "true";
        }
        const search = buildTextSearchFilter(req.query.q, [
          "title",
          "excerpt",
          "tags",
        ]);
        return { ...filter, ...search };
      },
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateBlog = async (req, res) => {
  try {
    const current = await Blog.findOne({
      slug: String(req.params.slug || "").toLowerCase(),
    }).select("publishedAt");
    if (!current) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const update = normalizedBody(req.body, { updating: true });
    if (update.status === "active" && current.publishedAt && !req.body.publishedAt) {
      update.publishedAt = current.publishedAt;
    }

    const blog = await Blog.findOneAndUpdate(
      { slug: String(req.params.slug || "").toLowerCase() },
      update,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteBlog = softDelete.deleteBySlug;
export const restoreBlog = softDelete.restoreBySlug;
