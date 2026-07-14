import mongoose from "mongoose";
import Course from "./course.model.js";
import Product from "../product/product.model.js";
import Vendor from "../vendor/vendor.model.js";
import SkillingArea from "../skilling-area/skilling-area.model.js";
import SkillLevel from "../skill-level/skill-level.model.js";
import Industry from "../industry/industry.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

/**
 * Catalog filter schema — add a group here and the UI renders it automatically.
 * Options are faceted: only values that still match courses (given other filters).
 */
export const CATALOG_FILTER_GROUPS = [
  {
    key: "vendor",
    label: "Vendor",
    searchable: true,
    searchPlaceholder: "Search Vendor",
    defaultOpen: true,
    clearKeys: ["product"],
  },
  {
    key: "product",
    label: "Product",
    field: "product",
    searchable: true,
    searchPlaceholder: "Search Product",
    defaultOpen: true,
  },
  {
    key: "skillingArea",
    label: "Skilling Area",
    field: "skillingAreas",
    isArray: true,
    searchable: true,
    searchPlaceholder: "Search Skilling Area",
    defaultOpen: true,
  },
  {
    key: "skillLevel",
    label: "Skill Level",
    field: "skillLevel",
    searchable: true,
    searchPlaceholder: "Search Skill Level",
    defaultOpen: true,
  },
  {
    key: "industry",
    label: "Industry",
    field: "industries",
    isArray: true,
    searchable: true,
    searchPlaceholder: "Search Industry",
    defaultOpen: true,
  },
];

const MODEL_BY_KEY = {
  vendor: Vendor,
  product: Product,
  skillingArea: SkillingArea,
  skillLevel: SkillLevel,
  industry: Industry,
};

function parseIds(value) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : String(value).split(",");
  return raw
    .map((id) => String(id).trim())
    .filter(Boolean)
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));
}

function toOption(doc, count = 0) {
  return {
    id: String(doc._id),
    label: doc.name,
    slug: doc.slug || undefined,
    logo: doc.logoUrl || doc.vendorCatalogueLogo || undefined,
    count,
  };
}

async function resolveProductIds({ vendor, product }) {
  const vendorIds = parseIds(vendor);
  const productIds = parseIds(product);

  let allowed = null;

  if (vendorIds.length) {
    const vendorProducts = await Product.find({ vendor: { $in: vendorIds } })
      .select("_id")
      .lean();
    allowed = vendorProducts.map((p) => p._id);
    if (allowed.length === 0) return [];
  }

  if (productIds.length) {
    if (allowed) {
      const allowedSet = new Set(allowed.map(String));
      return productIds.filter((id) => allowedSet.has(String(id)));
    }
    return productIds;
  }

  return allowed; // null = no product restriction
}

/**
 * Build a Course mongoose filter from query params using CATALOG_FILTER_GROUPS.
 * @param {object} query
 * @param {{ excludeKey?: string }} [options] - omit one filter key when building facets
 */
async function buildCourseFilter(query, { excludeKey } = {}) {
  const filter = {};
  const q = String(query.q || "").trim();

  const vendorParam = excludeKey === "vendor" ? undefined : query.vendor;
  const productParam = excludeKey === "product" ? undefined : query.product;

  // When faceting vendors, ignore product too (product implies a vendor path)
  const productIds = await resolveProductIds({
    vendor: vendorParam,
    product: excludeKey === "vendor" ? undefined : productParam,
  });
  if (productIds !== null) {
    filter.product = { $in: productIds };
  }

  for (const group of CATALOG_FILTER_GROUPS) {
    if (!group.field || group.key === "product") continue;
    if (group.key === excludeKey) continue;
    const ids = parseIds(query[group.key]);
    if (ids.length) {
      filter[group.field] = { $in: ids };
    }
  }

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  return { filter, q };
}

/**
 * Distinct facet values + counts from courses matching `matchFilter`.
 */
async function aggregateFacetCounts(group, matchFilter) {
  const pipeline = [{ $match: matchFilter }];

  if (group.key === "vendor") {
    pipeline.push(
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDoc",
        },
      },
      { $unwind: "$productDoc" },
      { $group: { _id: "$productDoc.vendor", count: { $sum: 1 } } }
    );
  } else if (group.isArray) {
    pipeline.push(
      { $unwind: `$${group.field}` },
      { $group: { _id: `$${group.field}`, count: { $sum: 1 } } }
    );
  } else {
    pipeline.push({
      $group: { _id: `$${group.field}`, count: { $sum: 1 } },
    });
  }

  pipeline.push({ $match: { _id: { $ne: null } } });

  const rows = await Course.aggregate(pipeline);
  const counts = new Map();
  for (const row of rows) {
    counts.set(String(row._id), row.count);
  }
  return counts;
}

async function loadFacetOptions(group, counts, selectedIds) {
  const Model = MODEL_BY_KEY[group.key];
  if (!Model) return [];

  const idSet = new Set([...counts.keys(), ...selectedIds.map(String)]);
  const ids = [...idSet].filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (!ids.length) return [];

  const sort =
    group.key === "skillLevel" ||
    group.key === "skillingArea" ||
    group.key === "industry"
      ? { sortOrder: 1, name: 1 }
      : { name: 1 };

  const docs = await Model.find({ _id: { $in: ids } })
    .select("name slug status sortOrder logoUrl vendorCatalogueLogo")
    .sort(sort)
    .lean();

  // Keep selected options even if count is 0 (so user can uncheck)
  return docs
    .map((doc) => toOption(doc, counts.get(String(doc._id)) || 0))
    .filter((opt) => opt.count > 0 || selectedIds.some((id) => String(id) === opt.id))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });
}

/**
 * Catalog listing
 * GET /courses/catalog?...filter keys from CATALOG_FILTER_GROUPS...
 */
export const catalogCourses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const { filter, q } = await buildCourseFilter(req.query);

    const activeFilters = {};
    for (const group of CATALOG_FILTER_GROUPS) {
      activeFilters[group.key] = req.query[group.key] || null;
    }
    activeFilters.q = q || null;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate({
          path: "product",
          select: "name slug status category vendor",
          populate: {
            path: "vendor",
            select: "name slug status isVerified logoUrl",
          },
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
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: courses.length,
      filters: activeFilters,
      data: courses,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/**
 * Faceted sidebar filter options — only values that still return courses.
 * Pass the same query params as the catalog so facets stay in sync.
 * GET /courses/catalog/filters?vendor=&product=&skillingArea=&skillLevel=&industry=&q=
 */
export const getCatalogFilters = async (req, res) => {
  try {
    const groups = [];

    for (const group of CATALOG_FILTER_GROUPS) {
      const { filter } = await buildCourseFilter(req.query, {
        excludeKey: group.key,
      });
      const counts = await aggregateFacetCounts(group, filter);
      const selectedIds = parseIds(req.query[group.key]);
      const options = await loadFacetOptions(group, counts, selectedIds);

      groups.push({
        key: group.key,
        label: group.label,
        type: "multi",
        searchable: Boolean(group.searchable),
        searchPlaceholder: group.searchPlaceholder || `Search ${group.label}`,
        defaultOpen: group.defaultOpen !== false,
        clearKeys: group.clearKeys || [],
        options,
      });
    }

    const { filter: activeFilter } = await buildCourseFilter(req.query);
    const matchingCourses = await Course.countDocuments(activeFilter);

    res.json({
      success: true,
      groups,
      meta: {
        matchingCourses,
        groupKeys: groups.map((g) => g.key),
        faceted: true,
      },
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
