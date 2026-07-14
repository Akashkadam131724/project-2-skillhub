import { Schema, model } from "mongoose";

/**
 * SkillLevel → many Courses
 * Course → ONE SkillLevel
 */
const skillLevelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Skill level name is required"],
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

skillLevelSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = toSlug(this.name);
  }
});

skillLevelSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "skillLevel",
});

skillLevelSchema.index({ name: "text", description: "text" });

skillLevelSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug).toLowerCase() });
};

skillLevelSchema.statics.findActive = function () {
  return this.find({ status: "active" }).sort({ sortOrder: 1, name: 1 });
};

const SkillLevel = model("SkillLevel", skillLevelSchema);

export default SkillLevel;
export { toSlug as toSkillLevelSlug };
