import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [180, "Title cannot exceed 180 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers, and hyphens only",
      ],
    },
    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
      maxlength: [100000, "Blog content is too long"],
    },
    featuredImage: {
      type: String,
      trim: true,
      default: "",
    },
    imageAlt: {
      type: String,
      trim: true,
      maxlength: [180, "Image alt text cannot exceed 180 characters"],
      default: "",
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: "insights",
      index: true,
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true }],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 12,
        message: "A blog can have at most 12 tags",
      },
    },
    author: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, "Author name cannot exceed 100 characters"],
        default: "SkillHub Editorial",
      },
      role: {
        type: String,
        trim: true,
        maxlength: [100, "Author role cannot exceed 100 characters"],
        default: "",
      },
      avatar: { type: String, trim: true, default: "" },
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "draft"],
        message: "{VALUE} is not a valid status. Use active | inactive | draft",
      },
      default: "draft",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    readingTime: {
      type: Number,
      min: [1, "Reading time must be at least one minute"],
      max: [240, "Reading time cannot exceed 240 minutes"],
      default: 1,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [70, "SEO title cannot exceed 70 characters"],
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [180, "Meta description cannot exceed 180 characters"],
      default: "",
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
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadingTime(content) {
  const words = String(content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

blogSchema.pre("validate", function () {
  if (!this.slug && this.title) this.slug = toSlug(this.title);
  if (this.isModified("content")) this.readingTime = estimateReadingTime(this.content);
  if (this.status === "active" && !this.publishedAt) this.publishedAt = new Date();
});

blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1, publishedAt: -1 });

blogSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug || "").toLowerCase() });
};

const Blog = model("Blog", blogSchema);

export default Blog;
