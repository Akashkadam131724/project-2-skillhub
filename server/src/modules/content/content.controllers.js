import Content, {
  normalizeContentPath,
} from "./content.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const createContent = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.path) body.path = normalizeContentPath(body.path);
    // Homepage Content is system — only one `/` row (seeded), do not create another
    if (body.path === "/") {
      return res.status(400).json({
        success: false,
        message:
          "Homepage Content (path /) is system-managed. Edit it from Content pages or live CMS — do not create another.",
      });
    }
    const content = await Content.create(body);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getContents = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    // Exact public-path lookup (used by catch-all route)
    if (req.query.path !== undefined && req.query.path !== "") {
      const content = await Content.findByPath(req.query.path);
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Content not found" });
      }
      return res.json({ success: true, data: content });
    }

    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
        { path: { $regex: req.query.q, $options: "i" } },
        { slug: { $regex: req.query.q, $options: "i" } },
      ];
    }

    const [contents, total] = await Promise.all([
      Content.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: contents.length,
      data: contents,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getContentBySlug = async (req, res) => {
  try {
    const content = await Content.findBySlug(req.params.slug);
    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }
    res.json({ success: true, data: content });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateContent = async (req, res) => {
  try {
    const existing = await Content.findOne({
      slug: String(req.params.slug).toLowerCase(),
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    const body = { ...req.body };
    if (body.path !== undefined) {
      body.path = normalizeContentPath(body.path);
    }

    // Homepage is system: keep path `/`, keep slug `home`, stay active
    if (existing.path === "/") {
      body.path = "/";
      body.slug = "home";
      if (body.status === "inactive") {
        return res.status(400).json({
          success: false,
          message: "Homepage Content cannot be disabled. Edit sections via live CMS instead.",
        });
      }
      body.status = "active";
    }

    const content = await Content.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: content });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteContent = async (req, res) => {
  try {
    const existing = await Content.findOne({
      slug: String(req.params.slug).toLowerCase(),
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }
    if (existing.path === "/") {
      return res.status(400).json({
        success: false,
        message: "Homepage Content is system-managed and cannot be deleted.",
      });
    }

    const content = await Content.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    res.json({ success: true, message: "Content deleted", data: content });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
