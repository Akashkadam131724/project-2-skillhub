import { Schema, model } from "mongoose";

/**
 * Real-world Vendor schema (NetCom-style catalog fields)
 */

const addressSchema = new Schema(
  {
    line1: { type: String, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 60 },
    state: { type: String, trim: true, maxlength: 60 },
    country: { type: String, trim: true, maxlength: 60, default: "India" },
    pincode: {
      type: String,
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Pincode must be a valid 6-digit number"],
    },
  },
  { _id: false }
);

const vendorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
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

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Phone must be a valid 10-digit Indian number"],
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "pending"],
        message: "{VALUE} is not a valid status. Use active | inactive | pending",
      },
      default: "pending",
      index: true,
    },

    logoUrl: {
      type: String,
      trim: true,
      default: null,
    },

    partnerLogo: { type: String, trim: true, default: null },
    colorLogo: { type: String, trim: true, default: null },
    whiteLogo: { type: String, trim: true, default: null },
    vendorCatalogueLogo: { type: String, trim: true, default: null },

    overview: { type: String, trim: true, default: "" },
    overviewTitle: { type: String, trim: true, default: "" },
    subHeading: { type: String, trim: true, default: "" },
    shortDescription: { type: String, trim: true, default: "" },
    redirectUrl: { type: String, trim: true, default: "" },

    productCount: { type: Number, default: 0, min: 0 },
    courseCount: { type: Number, default: 0, min: 0 },
    certificationCount: { type: Number, default: 0, min: 0 },
    learnersCount: { type: Number, default: 0, min: 0 },

    address: addressSchema,

    categories: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "You can add at most 10 categories",
      },
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
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

vendorSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = toSlug(this.name);
  }
});

vendorSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.name = this.name.trim().replace(/\s+/g, " ");
  }
});

vendorSchema.index({ name: "text", description: "text", shortDescription: "text" });

vendorSchema.virtual("isLive").get(function () {
  return this.status === "active" && this.isVerified === true;
});

vendorSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "vendor",
});

vendorSchema.methods.activate = function () {
  this.status = "active";
  return this.save();
};

vendorSchema.methods.deactivate = function () {
  this.status = "inactive";
  return this.save();
};

vendorSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: String(slug).toLowerCase() });
};

vendorSchema.statics.findActive = function () {
  return this.find({ status: "active" }).sort({ createdAt: -1 });
};

const Vendor = model("Vendor", vendorSchema);

export default Vendor;
