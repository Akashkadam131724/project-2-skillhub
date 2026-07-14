import { Schema } from "mongoose";
import { createCmsButtonSchema } from "./button.schema.js";

/**
 * Structured list item on a page-section mapping (cards, FAQ, stats, …).
 * Fresh schema per call — do not reuse one instance on Section + EntityPageSection.
 */
export function createCmsItemSchema() {
  return new Schema(
    {
      /** Primary text — card title, FAQ question, benefit name, … */
      title: { type: String, trim: true, default: "", maxlength: 200 },

      /** Secondary line under title */
      subtitle: { type: String, trim: true, default: "", maxlength: 300 },

      /** Longer copy — FAQ answer, card body, quote, … */
      body: { type: String, trim: true, default: "" },

      /** Short chip / eyebrow / stat label */
      label: { type: String, trim: true, default: "", maxlength: 120 },

      /** Compact value — stats ("1M+"), codes, … */
      value: { type: String, trim: true, default: "", maxlength: 80 },

      /** Optional image for this card */
      image_url: { type: String, trim: true, default: "" },

      /**
       * Optional solid color or CSS gradient for banner slides (white text).
       * Examples: "#0b1f4d" or "linear-gradient(135deg, #0f172a, #1e3a8a)"
       */
      bg_color: { type: String, trim: true, default: "", maxlength: 400 },

      /** Optional icon key or image URL — section UI interprets */
      icon: { type: String, trim: true, default: "" },

      /** Simple link when a full button isn't needed */
      href: { type: String, trim: true, default: "" },

      /** Per-item CTAs — new button schema instance (not shared with section.buttons) */
      buttons: { type: [createCmsButtonSchema()], default: [] },

      sort_order: { type: Number, default: 0 },

      status: { type: Boolean, default: true },
    },
    { _id: true }
  );
}

export default createCmsItemSchema();
