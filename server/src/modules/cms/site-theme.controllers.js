import SiteTheme from "./site-theme.model.js";
import {
  defaultSiteTheme,
  pickThemePatch,
  applyPresetFill,
} from "./theme.utils.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export const getSiteTheme = async (_req, res) => {
  try {
    const doc = await SiteTheme.getOrCreateDefault();
    res.json({ success: true, data: doc });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};

export const updateSiteTheme = async (req, res) => {
  try {
    const patch = pickThemePatch(req.body);
    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No theme fields provided",
      });
    }

    const filled = applyPresetFill({
      ...defaultSiteTheme(),
      ...patch,
    });

    const doc = await SiteTheme.findOneAndUpdate(
      { key: "default" },
      { $set: { ...filled, key: "default" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: doc });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
};
