import Product from "./product.model.js";
import Vendor from "../vendor/vendor.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const createProduct = async (req, res) => {
  try {
    const vendorId = req.body.vendor;
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        fields: { vendor: "Vendor is required" },
      });
    }

    const vendorExists = await Vendor.exists({ _id: vendorId });
    if (!vendorExists) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
        fields: { vendor: "No vendor with this id" },
      });
    }

    const product = await Product.create(req.body);
    await product.populate("vendor", "name slug status isVerified email");

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vendor) filter.vendor = req.query.vendor;
    if (req.query.category) filter.category = String(req.query.category).toLowerCase();
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("vendor", "name slug status isVerified logoUrl vendorCatalogueLogo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: products.length,
      data: products,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const vendorExists = await Vendor.exists({ _id: vendorId });
    if (!vendorExists) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const filter = { vendor: vendorId };
    if (req.query.status) filter.status = req.query.status;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      vendorId,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      count: products.length,
      data: products,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.body.vendor) {
      const vendorExists = await Vendor.exists({ _id: req.body.vendor });
      if (!vendorExists) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
          fields: { vendor: "No vendor with this id" },
        });
      }
    }

    const product = await Product.findOneAndUpdate(
      { slug: String(req.params.slug).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    ).populate("vendor", "name slug status isVerified email");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted", data: product });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
