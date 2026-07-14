import { Schema, model } from "mongoose";

/**
 * Page templates: product, course, vendor, home, industry, skilling_area, content, ...
 * entity_type links detail pages to a catalog model; null for static pages.
 */
const PAGE_ENTITY_TYPES = [
  null,
  "product",
  "course",
  "vendor",
  "industry",
  "skilling_area",
  "content",
];

const pageSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Page key is required"],
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
      required: [true, "Page name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    entity_type: {
      type: String,
      default: null,
      validate: {
        validator(v) {
          return v === null || v === undefined || PAGE_ENTITY_TYPES.includes(v);
        },
        message: `entity_type must be one of: ${PAGE_ENTITY_TYPES.filter(Boolean).join(", ")} or null`,
      },
    },

    status: {
      type: Boolean,
      default: true,
      index: true,
    },

    /**
     * When true (default): template-tagged sections use Section.pages[].sort_order only
     * (entity overrides of sort are ignored — safer for course/vendor-like templates).
     * Page-mapped extras (EntityPageSection without page_tag_id) always use their own
     * sort_order so newly mapped sections can be placed on that page.
     * When false: live entity CMS may reorder all placements via EntityPageSection.sort_order.
     */
    is_sort_disabled: {
      type: Boolean,
      default: true,
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

pageSchema.statics.findByKey = function (key) {
  return this.findOne({ key: String(key).toLowerCase() });
};

pageSchema.statics.findActive = function () {
  return this.find({ status: true }).sort({ name: 1 });
};

const Page = model("Page", pageSchema);

export default Page;
export { PAGE_ENTITY_TYPES };
