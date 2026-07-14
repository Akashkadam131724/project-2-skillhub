import Industry from "./industry.model.js";
import Course from "../course/course.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";
import mongoose from "mongoose";

function parseIds(value) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : String(value).split(",");
  return raw
    .map((id) => String(id).trim())
    .filter(Boolean)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
}

export const createIndustry = async (req, res) => {
  try {
    const industry = await Industry.create(req.body);
    res.status(201).json({ success: true, data: industry });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getIndustries = async (req, res) => {
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

    const [industries, total] = await Promise.all([
      Industry.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Industry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: industries.length,
      data: industries,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getIndustryBySlug = async (req, res) => {
  try {
    const industry = await Industry.findBySlug(req.params.slug);
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.json({ success: true, data: industry });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getCoursesByIndustry = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const industry = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? await Industry.findById(idOrSlug)
      : await Industry.findBySlug(idOrSlug);

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    const filter = { industries: industry._id };
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate("product", "name slug status category")
        .populate("skillLevel", "name slug")
        .populate("skillingAreas", "name slug")
        .populate("industries", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      industry,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateIndustry = async (req, res) => {
  try {
    const industry = await Industry.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    res.json({ success: true, data: industry });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteIndustry = async (req, res) => {
  try {
    const industry = await Industry.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    await Course.updateMany(
      { industries: industry._id },
      { $pull: { industries: industry._id } }
    );

    res.json({ success: true, message: "Industry deleted", data: industry });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/**
 * Replace industries on a course
 * PUT /industries/map/course/:courseId
 * body: { industries: [id, id] }
 */
export const mapCourseIndustries = async (req, res) => {
  try {
    const ids = parseIds(req.body.industries);

    if (ids.length) {
      const count = await Industry.countDocuments({ _id: { $in: ids } });
      if (count !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more industry ids are invalid",
        });
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { industries: ids },
      { new: true, runValidators: true }
    )
      .populate("industries", "name slug")
      .populate("skillLevel", "name slug")
      .populate("product", "name slug");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
