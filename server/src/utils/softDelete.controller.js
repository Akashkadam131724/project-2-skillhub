import { formatMongooseError } from "./formatMongooseError.js";

/**
 * Shared DELETE → softDeleteOne and POST restore handlers.
 * @param {{ Model: import('mongoose').Model, label: string, beforeDelete?: (doc: object) => Promise<boolean|void> }} config
 * beforeDelete returns true to abort (response already sent).
 */
export function createSoftDeleteController({
  Model,
  label,
  beforeDelete,
}) {
  return {
    async deleteBySlug(req, res) {
      try {
        const slug = String(req.params.slug || "").toLowerCase();
        const existing = await Model.findOne({ slug });
        if (!existing) {
          return res
            .status(404)
            .json({ success: false, message: `${label} not found` });
        }
        if (beforeDelete) {
          const abort = await beforeDelete(existing, req, res);
          if (abort) return;
        }
        const doc = await Model.softDeleteOne({ slug });
        res.json({
          success: true,
          message: `${label} deleted`,
          data: doc,
        });
      } catch (err) {
        const formatted = formatMongooseError(err);
        res.status(formatted.status).json(formatted);
      }
    },

    async restoreBySlug(req, res) {
      try {
        const slug = String(req.params.slug || "").toLowerCase();
        const doc = await Model.restoreOne({ slug });
        if (!doc) {
          return res
            .status(404)
            .json({ success: false, message: `${label} not found` });
        }
        res.json({
          success: true,
          message: `${label} restored`,
          data: doc,
        });
      } catch (err) {
        const formatted = formatMongooseError(err);
        res.status(formatted.status).json(formatted);
      }
    },
  };
}
