import mongoose from "mongoose";
import Page from "./page.model.js";
import EntityPageTheme from "./entity-page-theme.model.js";
import {
  emptyPageTheme,
  pickThemePatch,
} from "./theme.utils.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const getEntityPageTheme = async (req, res) => {
  try {
    const page_key = String(req.query.page_key || "").toLowerCase();
    const entity_id = req.query.entity_id;

    if (!page_key || !entity_id) {
      return res.status(400).json({
        success: false,
        message: "page_key and entity_id are required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(entity_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entity_id",
      });
    }

    const page = await Page.findByKey(page_key);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const doc = await EntityPageTheme.findForEntity(page_key, entity_id);
    res.json({
      success: true,
      data: doc || {
        page_key,
        entity_id,
        theme: emptyPageTheme(),
      },
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const upsertEntityPageTheme = async (req, res) => {
  try {
    const page_key = String(req.body.page_key || "").toLowerCase();
    const entity_id = req.body.entity_id;

    if (!page_key || !entity_id) {
      return res.status(400).json({
        success: false,
        message: "page_key and entity_id are required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(entity_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entity_id",
      });
    }

    const page = await Page.findByKey(page_key);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const theme = {
      ...emptyPageTheme(),
      ...pickThemePatch(req.body.theme || {}),
    };

    const doc = await EntityPageTheme.findOneAndUpdate(
      { page_key, entity_id },
      { $set: { page_key, entity_id, theme } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({ success: true, data: doc });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const deleteEntityPageTheme = async (req, res) => {
  try {
    const page_key = String(req.query.page_key || "").toLowerCase();
    const entity_id = req.query.entity_id;

    if (!page_key || !entity_id) {
      return res.status(400).json({
        success: false,
        message: "page_key and entity_id are required",
      });
    }

    const deleted = await EntityPageTheme.findOneAndDelete({
      page_key,
      entity_id,
    });

    res.json({
      success: true,
      message: deleted ? "Entity page theme cleared" : "Nothing to clear",
      data: deleted,
    });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
