import { Schema, model } from "mongoose";
import { createCmsButtonSchema } from "./button.schema.js";
import { createCmsItemSchema } from "./item.schema.js";

/**
 * Per-entity placement on a page.
 *
 * Two kinds:
 *  1. Template override — page_tag_id set → customizes / disables a template tag
 *  2. Entity extra     — page_tag_id null → adds a section on THIS entity only
 *     (e.g. map FAQ twice on one vendor without changing the vendor template)
 */
const entityPageSectionSchema = new Schema(
  {
    page_key: {
      type: String,
      required: [true, "page_key is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    entity_id: {
      type: Schema.Types.ObjectId,
      required: [true, "entity_id is required"],
      index: true,
    },

    /**
     * Subdocument _id from Section.pages[] when overriding a template tag.
     * null = entity-only extra placement (not on the template).
     */
    page_tag_id: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "Section is required"],
      index: true,
    },

    section_key: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /** null = keep template sort_order (only used when Page.is_sort_disabled is false) */
    sort_order: {
      type: Number,
      default: null,
    },

    section_title: { type: String, trim: true, default: null },
    sub_title: { type: String, trim: true, default: null },
    in_page_nav_title: { type: String, trim: true, default: null },
    section_bg_img: { type: String, trim: true, default: null },
    section_img_url: { type: String, trim: true, default: null },
    data: { type: Schema.Types.Mixed, default: null },

    /**
     * Placement CTAs.
     * undefined → inherit (tag → Section when cascading); [] → none; […] → these.
     * Ignored when Section.content_scope === "global".
     */
    buttons: { type: [createCmsButtonSchema()] },

    /**
     * Item-driven lists (FAQ, benefits, stats, …).
     * undefined → inherit (tag → Section when cascading); [] → none; […] → these.
     * Ignored when Section.content_scope === "global".
     */
    items: { type: [createCmsItemSchema()] },

    /**
     * null  = inherit template placement status (overrides only)
     * true  = enabled
     * false = hidden on this entity page
     */
    status: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        ret.is_entity_extra = !ret.page_tag_id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// One override per template tag per entity (skip docs with null page_tag_id)
entityPageSectionSchema.index(
  { page_key: 1, entity_id: 1, page_tag_id: 1 },
  {
    unique: true,
    partialFilterExpression: { page_tag_id: { $type: "objectId" } },
  }
);
entityPageSectionSchema.index({ page_key: 1, entity_id: 1, sort_order: 1 });

const EntityPageSection = model("EntityPageSection", entityPageSectionSchema);

export default EntityPageSection;
