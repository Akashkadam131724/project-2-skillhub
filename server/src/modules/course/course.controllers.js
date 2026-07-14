import Course from "./course.model.js";
import Product from "../product/product.model.js";
import SkillingArea from "../skilling-area/skilling-area.model.js";
import SkillLevel from "../skill-level/skill-level.model.js";
import Industry from "../industry/industry.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

async function assertRefs(Model, ids, fieldLabel) {
  if (!ids?.length) return null;
  const count = await Model.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) {
    return {
      success: false,
      message: "Validation failed",
      fields: { [fieldLabel]: `One or more ${fieldLabel} ids are invalid` },
    };
  }
  return null;
}

async function assertSkillLevel(id) {
  if (!id) return null;
  const exists = await SkillLevel.exists({ _id: id });
  if (!exists) {
    return {
      success: false,
      message: "Validation failed",
      fields: { skillLevel: "No skill level with this id" },
    };
  }
  return null;
}

const coursePopulate = [
  { path: "product", select: "name slug status category vendor" },
  { path: "skillLevel", select: "name slug status" },
  { path: "skillingAreas", select: "name slug status" },
  { path: "industries", select: "name slug status" },
];

export const createCourse = async (req, res) => {
  try {
    const productId = req.body.product;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        fields: { product: "Product is required" },
      });
    }

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        fields: { product: "No product with this id" },
      });
    }

    const skillLevelError = await assertSkillLevel(req.body.skillLevel);
    if (skillLevelError) return res.status(400).json(skillLevelError);

    const areaError = await assertRefs(
      SkillingArea,
      req.body.skillingAreas,
      "skillingAreas"
    );
    if (areaError) return res.status(400).json(areaError);

    const industryError = await assertRefs(
      Industry,
      req.body.industries,
      "industries"
    );
    if (industryError) return res.status(400).json(industryError);

    const course = await Course.create(req.body);
    await course.populate(coursePopulate);

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getCourses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.skillLevel) filter.skillLevel = req.query.skillLevel;
    if (req.query.skillingArea) filter.skillingAreas = req.query.skillingArea;
    if (req.query.industry) filter.industries = req.query.industry;
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
      ];
    }

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

export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findBySlug(req.params.slug);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, data: course });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getCoursesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const filter = { product: productId };

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate({
          path: "product",
          select: "name slug status category vendor",
          populate: { path: "vendor", select: "name slug" },
        })
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
      productId,
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

export const updateCourse = async (req, res) => {
  try {
    if (req.body.product) {
      const productExists = await Product.exists({ _id: req.body.product });
      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
          fields: { product: "No product with this id" },
        });
      }
    }

    if (req.body.skillLevel !== undefined && req.body.skillLevel !== null) {
      const skillLevelError = await assertSkillLevel(req.body.skillLevel);
      if (skillLevelError) return res.status(400).json(skillLevelError);
    }

    if (req.body.skillingAreas !== undefined) {
      const areaError = await assertRefs(
        SkillingArea,
        req.body.skillingAreas,
        "skillingAreas"
      );
      if (areaError) return res.status(400).json(areaError);
    }

    if (req.body.industries !== undefined) {
      const industryError = await assertRefs(
        Industry,
        req.body.industries,
        "industries"
      );
      if (industryError) return res.status(400).json(industryError);
    }

    const course = await Course.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    ).populate(coursePopulate);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course deleted", data: course });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
