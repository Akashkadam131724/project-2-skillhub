import { Schema, model } from "mongoose";
import {
  defaultSiteTheme,
  themeSchemaFields,
} from "./theme.utils.js";

/**
 * Singleton site-wide theme (key = "default").
 * Page.theme overrides this per template (home, vendor, …).
 */
const siteThemeSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: "default",
    },
    ...themeSchemaFields({ nullable: false }),
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

siteThemeSchema.statics.getOrCreateDefault = async function () {
  let doc = await this.findOne({ key: "default" });
  if (!doc) {
    doc = await this.create({ key: "default", ...defaultSiteTheme() });
  }
  return doc;
};

const SiteTheme = model("SiteTheme", siteThemeSchema);

export default SiteTheme;
