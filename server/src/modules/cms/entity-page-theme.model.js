import { Schema, model } from "mongoose";
import {
  emptyPageTheme,
  themeSchemaFields,
} from "./theme.utils.js";

/**
 * Per-entity page theme override (this vendor / product / … page only).
 * Cascades: SiteTheme ← Page.theme ← EntityPageTheme.theme
 */
const entityThemeSchema = new Schema(themeSchemaFields({ nullable: true }), {
  _id: false,
});

const entityPageThemeSchema = new Schema(
  {
    page_key: {
      type: String,
      required: [true, "page_key is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    entity_id: {
      type: Schema.Types.ObjectId,
      required: [true, "entity_id is required"],
      index: true,
    },

    theme: {
      type: entityThemeSchema,
      default: () => emptyPageTheme(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

entityPageThemeSchema.index(
  { page_key: 1, entity_id: 1 },
  { unique: true }
);

entityPageThemeSchema.statics.findForEntity = function (pageKey, entityId) {
  return this.findOne({
    page_key: String(pageKey).toLowerCase(),
    entity_id: entityId,
  });
};

const EntityPageTheme = model("EntityPageTheme", entityPageThemeSchema);

export default EntityPageTheme;
