import { Schema, model } from "mongoose";

/**
 * Product → belongs to ONE Vendor (required ref)
 * Vendor → can have MANY Products (query by vendor / virtual populate)
 */
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
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

    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: "general",
    },

    images: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 8,
        message: "You can add at most 8 images",
      },
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

    // ONE vendor per product (many products → one vendor)
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor is required"],
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

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

productSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = toSlug(this.name);
  }
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ vendor: 1, status: 1 });

// Product has MANY courses (reverse of Course.product)
productSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "product",
});

productSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug).toLowerCase() }).populate(
    "vendor",
    "name slug status isVerified email logoUrl vendorCatalogueLogo"
  );
};

productSchema.statics.findByVendor = function (vendorId) {
  return this.find({ vendor: vendorId }).sort({ createdAt: -1 });
};

const Product = model("Product", productSchema);

export default Product;
