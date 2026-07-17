import { Schema, model } from "mongoose";

/**
 * Generic content pages — catalog entity for CMS-driven routes.
 *
 * - `slug`: stable API id (kebab, no slashes) — used in /contents/:slug
 * - `path`: real public URL path (with leading slash)
 *     `/`                 → homepage
 *     `/about-us`         → about page
 *     `/company/careers`  → careers
 */

const PATH_SEGMENT = "[a-z0-9]+(?:-[a-z0-9]+)*";
const PATH_REGEX = new RegExp(
  `^/(?:${PATH_SEGMENT}(?:/${PATH_SEGMENT})*)?$`
);

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalize public path to a real URL path:
 * - lowercase, collapse slashes
 * - always leading `/`
 * - no trailing slash (except root `/`)
 */
export function normalizeContentPath(value) {
  let p = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\/+/g, "/");
  if (!p || p === "/") return "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/** Derive API slug from path (`/company/careers` → `company-careers`, `/` → `home`) */
export function slugFromPath(path) {
  const p = normalizeContentPath(path);
  if (p === "/") return "home";
  return p.slice(1).replace(/\//g, "-");
}

const contentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Content name is required"],
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

    /**
     * Real public URL path (leading slash). Unique.
     * Examples: `/`, `/about-us`, `/company/careers`
     */
    path: {
      type: String,
      unique: true,
      trim: true,
      match: [
        PATH_REGEX,
        "Path must be a URL path like / or /about-us or /company/careers",
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

contentSchema.pre("validate", function () {
  if (this.path != null && this.path !== "") {
    this.path = normalizeContentPath(this.path);
  }
  if (this.slug) {
    this.slug = String(this.slug).toLowerCase().trim();
  }

  if (!this.path && this.slug) {
    this.path = normalizeContentPath(this.slug);
  }
  if (!this.path && this.name) {
    this.path = normalizeContentPath(toSlug(this.name));
  }
  if (!this.slug && this.path) {
    this.slug = slugFromPath(this.path);
  }
  if (!this.slug && this.name) {
    this.slug = toSlug(this.name);
  }
});

contentSchema.index({ name: "text", description: "text" });

contentSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug).toLowerCase() });
};

contentSchema.statics.findByPath = function (path) {
  return this.findOne({ path: normalizeContentPath(path) });
};

contentSchema.statics.findActive = function () {
  return this.find({ status: "active" }).sort({ sortOrder: 1, name: 1 });
};

const Content = model("Content", contentSchema);

export default Content;
export { toSlug as toContentSlug, PATH_REGEX as CONTENT_PATH_REGEX };
