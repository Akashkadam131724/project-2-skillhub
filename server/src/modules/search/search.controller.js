import Vendor from "../vendor/vendor.model.js";
import Product from "../product/product.model.js";
import Course from "../course/course.model.js";
import SkillingArea from "../skilling-area/skilling-area.model.js";
import Industry from "../industry/industry.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

const SEARCH_SOURCES = [
  {
    type: "vendor",
    label: "Vendors",
    filterKey: "vendor",
    detailPath: "vendors",
    Model: Vendor,
    fields: ["name", "slug", "description", "shortDescription"],
    select: "name slug logoUrl vendorCatalogueLogo shortDescription status",
    statusFilter: { status: { $in: ["active", "pending"] } },
    mapItem: (doc) => ({
      id: String(doc._id),
      name: doc.name,
      slug: doc.slug,
      logo: doc.logoUrl || doc.vendorCatalogueLogo || null,
      description: doc.shortDescription || "",
    }),
  },
  {
    type: "product",
    label: "Products",
    filterKey: "product",
    detailPath: "products",
    Model: Product,
    fields: ["name", "slug", "description", "category"],
    select: "name slug description category status vendor",
    populate: { path: "vendor", select: "name slug logoUrl vendorCatalogueLogo" },
    statusFilter: { status: { $in: ["active", "draft"] } },
    mapItem: (doc) => ({
      id: String(doc._id),
      name: doc.name,
      slug: doc.slug,
      description: doc.description || "",
      vendorName: doc.vendor?.name || null,
      logo: doc.vendor?.logoUrl || doc.vendor?.vendorCatalogueLogo || null,
    }),
  },
  {
    type: "course",
    label: "Courses",
    filterKey: "q",
    detailPath: "courses",
    Model: Course,
    fields: ["name", "slug", "description"],
    select: "name slug description product",
    populate: {
      path: "product",
      select: "name slug vendor",
      populate: { path: "vendor", select: "name slug logoUrl vendorCatalogueLogo" },
    },
    mapItem: (doc) => ({
      id: String(doc._id),
      name: doc.name,
      slug: doc.slug,
      description: doc.description || "",
      vendorName: doc.product?.vendor?.name || doc.product?.name || null,
      logo:
        doc.product?.vendor?.logoUrl ||
        doc.product?.vendor?.vendorCatalogueLogo ||
        null,
    }),
  },
  {
    type: "skillingArea",
    label: "Skilling Areas",
    filterKey: "skillingArea",
    detailPath: "skilling-areas",
    Model: SkillingArea,
    fields: ["name", "slug", "description"],
    select: "name slug description status sortOrder",
    statusFilter: { status: "active" },
    mapItem: (doc) => ({
      id: String(doc._id),
      name: doc.name,
      slug: doc.slug,
      description: doc.description || "",
    }),
  },
  {
    type: "industry",
    label: "Industries",
    filterKey: "industry",
    detailPath: "industries",
    Model: Industry,
    fields: ["name", "slug", "description"],
    select: "name slug description status sortOrder",
    statusFilter: { status: "active" },
    mapItem: (doc) => ({
      id: String(doc._id),
      name: doc.name,
      slug: doc.slug,
      description: doc.description || "",
    }),
  },
];

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTextFilter(fields, q) {
  const regex = { $regex: escapeRegex(q), $options: "i" };
  return {
    $or: fields.map((field) => ({ [field]: regex })),
  };
}

/**
 * Global search across vendors, products, courses, skilling areas, and industries.
 * GET /search?q=&limit=
 */
export const globalSearch = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 20);

    if (q.length < 2) {
      return res.json({
        success: true,
        q,
        total: 0,
        groups: [],
        message: "Type at least 2 characters to search",
      });
    }

    const groups = await Promise.all(
      SEARCH_SOURCES.map(async (source) => {
        let query = source.Model.find({
          ...buildTextFilter(source.fields, q),
          ...(source.statusFilter || {}),
        })
          .select(source.select)
          .sort({ name: 1 })
          .limit(limit);

        if (source.populate) {
          query = query.populate(source.populate);
        }

        const docs = await query.lean();

        const items = docs.map((doc) => {
          const item = source.mapItem(doc);
          return {
            ...item,
            type: source.type,
            filterKey: source.filterKey,
            href: `/${source.detailPath}/${item.slug}`,
          };
        });

        return {
          type: source.type,
          label: source.label,
          filterKey: source.filterKey,
          count: items.length,
          items,
        };
      })
    );

    const nonEmpty = groups.filter((g) => g.count > 0);
    const total = nonEmpty.reduce((sum, g) => sum + g.count, 0);

    res.json({
      success: true,
      q,
      total,
      groups: nonEmpty,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
