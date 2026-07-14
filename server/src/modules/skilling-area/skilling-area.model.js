import { Schema, model } from "mongoose";

/**
 * SkillingArea ↔ Course = many-to-many
 * - Course.skillingAreas[] holds the refs
 * - SkillingArea.courses is a virtual reverse populate
 */
const skillingAreaSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Skilling area name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase letters, numbers, and hyphens only",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not a valid status. Use active | inactive",
      },
      default: "active",
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
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

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

skillingAreaSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = toSlug(this.name);
  }
});

// Reverse: one skilling area → many courses
skillingAreaSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "skillingAreas",
});

skillingAreaSchema.index({ name: "text", description: "text" });

skillingAreaSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug).toLowerCase() });
};

skillingAreaSchema.statics.findActive = function () {
  return this.find({ status: "active" }).sort({ sortOrder: 1, name: 1 });
};

const SkillingArea = model("SkillingArea", skillingAreaSchema);

export default SkillingArea;
export { toSlug as toSkillingAreaSlug };
