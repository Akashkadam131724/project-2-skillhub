import { Schema, model } from "mongoose";

const sectionCategorySchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Category key is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
        "Key must be snake_case (a-z, 0-9, underscores)",
      ],
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    sort_order: {
      type: Number,
      default: 0,
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

sectionCategorySchema.statics.findByKey = function (key) {
  return this.findOne({ key: String(key).toLowerCase() });
};

const SectionCategory = model("SectionCategory", sectionCategorySchema);

export default SectionCategory;
