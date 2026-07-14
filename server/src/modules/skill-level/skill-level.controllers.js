import SkillLevel from "./skill-level.model.js";
import Course from "../course/course.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";
import mongoose from "mongoose";

export const createSkillLevel = async (req, res) => {
  try {
    const level = await SkillLevel.create(req.body);
    res.status(201).json({ success: true, data: level });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSkillLevels = async (req, res) => {
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

    const [levels, total] = await Promise.all([
      SkillLevel.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SkillLevel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: levels.length,
      data: levels,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSkillLevelBySlug = async (req, res) => {
  try {
    const level = await SkillLevel.findBySlug(req.params.slug);
    if (!level) {
      return res.status(404).json({ success: false, message: "Skill level not found" });
    }
    res.json({ success: true, data: level });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getCoursesBySkillLevel = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const level = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? await SkillLevel.findById(idOrSlug)
      : await SkillLevel.findBySlug(idOrSlug);

    if (!level) {
      return res.status(404).json({ success: false, message: "Skill level not found" });
    }

    const filter = { skillLevel: level._id };
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
      skillLevel: level,
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

export const updateSkillLevel = async (req, res) => {
  try {
    const level = await SkillLevel.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!level) {
      return res.status(404).json({ success: false, message: "Skill level not found" });
    }

    res.json({ success: true, data: level });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteSkillLevel = async (req, res) => {
  try {
    const level = await SkillLevel.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!level) {
      return res.status(404).json({ success: false, message: "Skill level not found" });
    }

    // Courses had one skill level — clear the ref
    await Course.updateMany(
      { skillLevel: level._id },
      { $unset: { skillLevel: 1 } }
    );

    res.json({ success: true, message: "Skill level deleted", data: level });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
