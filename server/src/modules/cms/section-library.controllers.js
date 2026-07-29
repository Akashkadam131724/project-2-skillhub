import {
  listSectionLibraryCategories,
  getShowcaseByKey,
  categoryKeyFromSlug,
} from "./section-library.service.js";
import { formatMongooseError } from "../../utils/formatMongooseError.js";

export async function getSectionLibraryCategories(req, res) {
  try {
    const data = await listSectionLibraryCategories();
    res.json({ success: true, ...data });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
}

export async function getSectionLibraryShowcase(req, res) {
  try {
    const raw = req.params.showcaseKey || req.query.showcase || "index";
    const showcaseKey =
      raw === "index" ? "index" : categoryKeyFromSlug(raw);
    const result = await getShowcaseByKey(showcaseKey);
    if (result.error) {
      return res
        .status(result.error.status)
        .json({ success: false, message: result.error.message });
    }
    res.json({ success: true, data: result });
  } catch (err) {
    const formatted = formatMongooseError(err);
    res.status(formatted.status).json(formatted);
  }
}
