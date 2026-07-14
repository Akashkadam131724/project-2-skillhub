import { Schema, model } from "mongoose";
import { createCmsButtonSchema } from "./button.schema.js";
import { createCmsItemSchema } from "./item.schema.js";

/** Content resolution mode on the Section catalog */
export const SECTION_CONTENT_SCOPES = ["global", "template", "page", "cascading"];

export function normalizeContentScope(scope) {
  const s = String(scope || "").toLowerCase();
  if (s === "global") return "global";
  if (s === "template") return "template";
  return "page"; // page | cascading | default
}

/**
 * Page tag embedded on a Section — "this section belongs to these pages".
 * Per-page sort, content overrides, and template status live here.
 *
 * Status layers:
 *  1. Section.status              — global on/off
 *  2. pages[].status              — enabled on this page template
 *  3. EntityPageSection.status    — enabled on a specific entity page
 *
 * Content / items / buttons when content_scope is:
 *  - global   → always Section
 *  - template → page tag → Section (entity cannot override content)
 *  - page     → entity → page tag → Section
 * Tags always control template sort_order + status.
 * Entity sort overrides only apply when Page.is_sort_disabled === false.
 */
const pageTagSchema = new Schema(
  {
    page: {
      type: Schema.Types.ObjectId,
      ref: "Page",
      required: [true, "Page is required"],
    },

    page_key: {
      type: String,
      required: [true, "page_key is required"],
      lowercase: true,
      trim: true,
    },

    /** Default sort order on this page template (customizable in template CMS) */
    sort_order: {
      type: Number,
      required: true,
      default: 0,
    },

    // null → inherit Section defaults
    section_title: { type: String, trim: true, default: null },
    sub_title: { type: String, trim: true, default: null },
    /** Label in sticky in-page nav (null → inherit section default / hide if empty) */
    in_page_nav_title: { type: String, trim: true, default: null },
    /** Optional background image URL for this placement */
    section_bg_img: { type: String, trim: true, default: null },
    /** Optional image — each section UI decides if/where to render it */
    section_img_url: { type: String, trim: true, default: null },
    /** Snapshot from Section at map time — not editable on the placement */
    section_preview_img: { type: String, trim: true, default: null },
    data: { type: Schema.Types.Mixed, default: null },

    /**
     * Template CTAs — undefined → inherit Section; [] → none; […] → these.
     * Ignored when Section.content_scope === "global".
     */
    buttons: { type: [createCmsButtonSchema()] },

    /**
     * Template list items (FAQ, benefits, …).
     * undefined → inherit Section; [] → none; […] → these.
     * Ignored when Section.content_scope === "global".
     */
    items: { type: [createCmsItemSchema()] },

    /** false → section disabled for this page template */
    status: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

/**
 * Global section catalog — BODY blocks only (overview, faq, …).
 * Tag pages via `pages[]` — each entry = one placement (duplicates allowed).
 *
 * Hero / banner is NOT a CMS section. It comes from the entity/page document
 * (Product.name, Vendor.overviewTitle, …) via DetailShell / PageBanner.
 */
const sectionSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Section key is required"],
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
      required: [true, "Section name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    // Default content (overridden by pages[] tag, then by entity override when cascading)
    section_title: { type: String, trim: true, default: "" },
    sub_title: { type: String, trim: true, default: "" },
    in_page_nav_title: { type: String, trim: true, default: "" },
    /** @deprecated Prefer `buttons[]` — kept for legacy single-CTA */
    button_title: { type: String, trim: true, default: "" },
    /** @deprecated Prefer `buttons[]` */
    target_url: { type: String, trim: true, default: "" },
    section_bg_img: { type: String, trim: true, default: "" },
    /** Optional image — section components opt in to render it */
    section_img_url: { type: String, trim: true, default: "" },
    /** CMS catalog preview — copied onto page tags when mapped */
    section_preview_img: { type: String, trim: true, default: "" },
    data: { type: Schema.Types.Mixed, default: {} },

    /**
     * Global CTAs — base layer for cascading; sole source when content_scope is global.
     * undefined / omit → none at this layer; [] → none; […] → these buttons.
     */
    buttons: { type: [createCmsButtonSchema()] },

    /**
     * Global list items — base layer for cascading; sole source when content_scope is global.
     */
    items: { type: [createCmsItemSchema()] },

    /**
     * How live pages resolve content / items / buttons:
     *  - global   — always Section; template/entity only sort + status
     *  - template — tag → Section; entity cannot override content
     *  - page     — entity → tag → Section (legacy alias: cascading)
     */
    content_scope: {
      type: String,
      enum: SECTION_CONTENT_SCOPES,
      default: "page",
      index: true,
    },

    /**
     * Placements of this section on pages.
     * Same page_key may appear more than once (e.g. two banners on product).
     * Each entry is an independent placement with its own sort_order / content / status.
     */
    pages: {
      type: [pageTagSchema],
      default: [],
    },

    /** Global on/off — false disables this section on every page */
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

sectionSchema.index({ "pages.page_key": 1, "pages.sort_order": 1 });
sectionSchema.index({ "pages.page": 1 });

sectionSchema.statics.findByKey = function (key) {
  return this.findOne({ key: String(key).toLowerCase() });
};

sectionSchema.statics.findActive = function () {
  return this.find({ status: true }).sort({ name: 1 });
};

/** All active sections tagged to a page_key (any template status) */
sectionSchema.statics.findTaggedToPage = function (pageKey) {
  return this.find({
    "pages.page_key": String(pageKey).toLowerCase(),
  }).sort({ key: 1 });
};

/** Add a new placement (allows same page_key more than once) */
sectionSchema.methods.tagPage = function (tag) {
  const key = String(tag.page_key).toLowerCase();
  this.pages.push({ ...tag, page_key: key });
  return this;
};

/** Update one placement by its subdocument _id */
sectionSchema.methods.updatePageTag = function (tagId, patch) {
  const tag = this.pages.id(tagId);
  if (!tag) return null;
  Object.assign(tag, patch);
  return tag;
};

/** Remove one placement by subdocument _id */
sectionSchema.methods.untagById = function (tagId) {
  const tag = this.pages.id(tagId);
  if (!tag) return false;
  tag.deleteOne();
  return true;
};

/** Remove all placements for a page_key */
sectionSchema.methods.untagPage = function (pageKey) {
  const key = String(pageKey).toLowerCase();
  const before = this.pages.length;
  this.pages = this.pages.filter((p) => p.page_key !== key);
  return before - this.pages.length;
};

const Section = model("Section", sectionSchema);

export default Section;
export { pageTagSchema };
