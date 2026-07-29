import { Schema, model } from "mongoose";

/**
 * One document per public section-library showcase surface
 * (index + each category). entity_id powers EntityPageSection for page_key `section`.
 */
const sectionLibrarySchema = new Schema(
  {
    showcase_key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    /** Public path segment after /section (empty string = index) */
    path_segment: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
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

sectionLibrarySchema.statics.findByShowcaseKey = function (key) {
  return this.findOne({ showcase_key: String(key).toLowerCase() });
};

const SectionLibrary = model("SectionLibrary", sectionLibrarySchema);

export default SectionLibrary;
