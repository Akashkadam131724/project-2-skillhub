import Section from "./section.model.js";
import SectionCategory from "./section-category.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const listSectionCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = req.query.status === "true" || req.query.status === true;
    }

    const categories = await SectionCategory.find(filter)
      .sort({ sort_order: 1, name: 1 })
      .lean();

    const counts = await Section.aggregate([
      { $match: { section_category: { $ne: null } } },
      { $group: { _id: "$section_category", count: { $sum: 1 } } },
    ]);
    const countById = new Map(counts.map((c) => [String(c._id), c.count]));

    const data = categories.map((cat) => ({
      ...cat,
      id: cat._id,
      section_count: countById.get(String(cat._id)) || 0,
    }));

    const uncategorized = await Section.countDocuments({
      $or: [
        { section_category: null },
        { section_category: { $exists: false } },
      ],
    });

    res.json({
      success: true,
      count: data.length,
      uncategorized_count: uncategorized,
      data,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getSectionCategoryByKey = async (req, res) => {
  try {
    const category = await SectionCategory.findByKey(req.params.key).lean();
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Section category not found",
      });
    }

    const section_count = await Section.countDocuments({
      section_category: category._id,
    });

    res.json({
      success: true,
      data: { ...category, id: category._id, section_count },
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
