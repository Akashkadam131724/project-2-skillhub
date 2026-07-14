import Vendor from "./vendor.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getvendors = async (req, res) => {
  try {
    // Never Vendor.find() all docs — 1M rows will OOM / hang the API
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (typeof req.query.isVerified !== "undefined") {
      filter.isVerified = req.query.isVerified === "true" || req.query.isVerified === true;
    }
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
        { shortDescription: { $regex: req.query.q, $options: "i" } },
      ];
    }

    const [vendors, total] = await Promise.all([
      Vendor.find(filter).sort({ courseCount: -1, name: 1 }).skip(skip).limit(limit).lean(),
      Vendor.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: vendors.length,
      data: vendors,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getVendorBySlug = async (req, res) => {
  try {
    const vendor = await Vendor.findBySlug(req.params.slug);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    res.json({ success: true, data: vendor });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateVendor = async (req, res) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const patch = { ...req.body };
    delete patch._id;
    delete patch.id;
    delete patch.slug; // slug is route identity — rename not supported here

    const updatedVendor = await Vendor.findOneAndUpdate(
      { slug },
      { $set: patch },
      { new: true, runValidators: true }
    );
    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, data: updatedVendor });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const vendor = await Vendor.findOneAndDelete({ slug });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, message: "Vendor deleted", data: { slug: vendor.slug } });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const searchVendors = async (req, res) => {
  try {
    const {
      q = "",                   // search query
      page = 1,                 // page number
      limit = 20,               // items per page
      status,                   // optional filter (active, inactive, etc.)
      isVerified,               // optional filter (true/false)
      category,                 // optional: filter by category (single or array)
    } = req.query;

    // Basic filter object
    const filter = {};

    // Text search: name or description (case-insensitive)
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Filter by isVerified if provided
    if (typeof isVerified !== "undefined") {
      // Accept "true"/"false" or boolean
      filter.isVerified = isVerified === "true" || isVerified === true;
    }

    // Filter by category (one or many)
    if (category) {
      if (Array.isArray(category)) {
        filter.categories = { $in: category };
      } else {
        filter.categories = category;
      }
    }

    // Pagination
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 100); // max 100/page
    const skip = (pageNum - 1) * limitNum;

    // Query: find with filter, paginate, sort newest first
    // Why use Promise.all here?
    // Running Vendor.find() and Vendor.countDocuments() together in parallel makes this faster.
    // If we did them one after another (await find, then await count), it would wait twice as long.
    // Instead, Promise.all runs both at once, and we await them both together.
    const [vendors, total] = await Promise.all([
      Vendor.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Vendor.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages,
      count: vendors.length,
      data: vendors,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};