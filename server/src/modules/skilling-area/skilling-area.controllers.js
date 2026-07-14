import SkillingArea from "./skilling-area.model.js";
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

export const createSkillingArea = async (req, res) => {
  try {
    const area = await SkillingArea.create(req.body);
    res.status(201).json({ success: true, data: area });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSkillingAreas = async (req, res) => {
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

    const [areas, total] = await Promise.all([
      SkillingArea.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SkillingArea.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: areas.length,
      data: areas,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSkillingAreaBySlug = async (req, res) => {
  try {
    const area = await SkillingArea.findBySlug(req.params.slug);
    if (!area) {
      return res.status(404).json({ success: false, message: "Skilling area not found" });
    }
    res.json({ success: true, data: area });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getCoursesBySkillingArea = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const area = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? await SkillingArea.findById(idOrSlug)
      : await SkillingArea.findBySlug(idOrSlug);

    if (!area) {
      return res.status(404).json({ success: false, message: "Skilling area not found" });
    }

    const filter = { skillingAreas: area._id };
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate("product", "name slug status category")
        .populate("skillingAreas", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      skillingArea: area,
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

export const updateSkillingArea = async (req, res) => {
  try {
    const area = await SkillingArea.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!area) {
      return res.status(404).json({ success: false, message: "Skilling area not found" });
    }

    res.json({ success: true, data: area });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteSkillingArea = async (req, res) => {
  try {
    const area = await SkillingArea.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!area) {
      return res.status(404).json({ success: false, message: "Skilling area not found" });
    }

    // Pull ref from courses (many-to-many cleanup)
    await Course.updateMany(
      { skillingAreas: area._id },
      { $pull: { skillingAreas: area._id } }
    );

    res.json({ success: true, message: "Skilling area deleted", data: area });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/**
 * Map courses ↔ skilling areas (replace set on a course)
 * PUT /skilling-areas/map/course/:courseId
 * body: { skillingAreas: [id, id] }
 */
export const mapCourseSkillingAreas = async (req, res) => {
  try {
    const ids = parseIds(req.body.skillingAreas);
    if (!ids.length && req.body.skillingAreas !== undefined) {
      // allow empty array to clear
    }

    if (ids.length) {
      const count = await SkillingArea.countDocuments({ _id: { $in: ids } });
      if (count !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more skilling area ids are invalid",
        });
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { skillingAreas: ids },
      { new: true, runValidators: true }
    )
      .populate("skillingAreas", "name slug")
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
