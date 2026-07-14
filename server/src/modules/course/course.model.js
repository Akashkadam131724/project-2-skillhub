import { Schema, model } from "mongoose";

/**
 * Course → belongs to ONE Product (required)
 * Course → belongs to ONE SkillLevel (optional)
 * Course ↔ SkillingArea / Industry = many-to-many
 */
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [120, "Name cannot exceed 120 characters"],
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
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },

    // ONE product per course (many courses → one product)
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },

    // ONE skill level per course (many courses → one skill level)
    skillLevel: {
      type: Schema.Types.ObjectId,
      ref: "SkillLevel",
      default: null,
    },

    // MANY skilling areas per course (and each area → many courses)
    skillingAreas: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "SkillingArea",
        },
      ],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "A course can have at most 20 skilling areas",
      },
    },

    // MANY industries per course (and each industry → many courses)
    industries: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Industry",
        },
      ],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "A course can have at most 20 industries",
      },
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
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

courseSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = toSlug(this.name);
  }
});

courseSchema.index({ name: "text", description: "text" });
courseSchema.index({ product: 1, createdAt: -1 });
courseSchema.index({ skillingAreas: 1 });
courseSchema.index({ industries: 1 });
courseSchema.index({ skillLevel: 1 });

courseSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug).toLowerCase() })
    .populate({
      path: "product",
      select: "name slug status category vendor",
      populate: {
        path: "vendor",
        select:
          "name slug status isVerified email logoUrl vendorCatalogueLogo",
      },
    })
    .populate("skillLevel", "name slug status")
    .populate("skillingAreas", "name slug status")
    .populate("industries", "name slug status");
};

courseSchema.statics.findByProduct = function (productId) {
  return this.find({ product: productId }).sort({ createdAt: -1 });
};

courseSchema.statics.findBySkillingArea = function (skillingAreaId) {
  return this.find({ skillingAreas: skillingAreaId }).sort({ createdAt: -1 });
};

courseSchema.statics.findBySkillLevel = function (skillLevelId) {
  return this.find({ skillLevel: skillLevelId }).sort({ createdAt: -1 });
};

courseSchema.statics.findByIndustry = function (industryId) {
  return this.find({ industries: industryId }).sort({ createdAt: -1 });
};

const Course = model("Course", courseSchema);

export default Course;
