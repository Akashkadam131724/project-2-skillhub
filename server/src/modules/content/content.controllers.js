import Content from "./content.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);
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
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
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
    const content = await Content.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    res.json({ success: true, message: "Content deleted", data: content });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
