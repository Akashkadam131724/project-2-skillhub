import Blog from "./blog.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

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
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) {
      filter.category = String(req.query.category).trim().toLowerCase();
    }
    if (req.query.tag) {
      filter.tags = String(req.query.tag).trim().toLowerCase();
    }
    if (req.query.featured !== undefined) {
      filter.featured = String(req.query.featured) === "true";
    }
    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const sort =
      req.query.sort === "oldest"
        ? { publishedAt: 1, createdAt: 1 }
        : { featured: -1, publishedAt: -1, createdAt: -1 };

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: blogs.length,
      data: blogs,
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

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      slug: String(req.params.slug || "").toLowerCase(),
    });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, message: "Blog deleted", data: blog });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
