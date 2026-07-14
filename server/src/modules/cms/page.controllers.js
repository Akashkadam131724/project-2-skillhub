import Page from "./page.model.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";
import { resolvePageSections } from "./resolve.js";

export const createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getPages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = req.query.status === "true" || req.query.status === true;
    }
    if (req.query.entity_type !== undefined) {
      filter.entity_type =
        req.query.entity_type === "null" || req.query.entity_type === ""
          ? null
          : req.query.entity_type;
    }

    const pages = await Page.find(filter).sort({ name: 1 }).lean();
    res.json({ success: true, count: pages.length, data: pages });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const getPageByKey = async (req, res) => {
  try {
    const page = await Page.findByKey(req.params.key);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updatePage = async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate(
      { key: String(req.params.key).toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const setPageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "status must be a boolean",
        fields: { status: "Expected true or false" },
      });
    }

    const page = await Page.findOneAndUpdate(
      { key: String(req.params.key).toLowerCase() },
      { status },
      { new: true }
    );
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deletePage = async (req, res) => {
  try {
    const page = await Page.findOneAndDelete({
      key: String(req.params.key).toLowerCase(),
    });
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    res.json({ success: true, message: "Page deleted", data: page });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

/** Resolved sections for a page (+ optional entityId) — frontend entry point */
export const getResolvedSections = async (req, res) => {
  try {
    const entityId = req.query.entityId || req.query.entity_id || null;
    const result = await resolvePageSections(req.params.key, entityId);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    res.json({ success: true, ...result });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
