import { Schema } from "mongoose";

/** Visual style of the button */
export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
  "inverse",
];

/**
 * What the button does when clicked:
 *  - url     → navigate to target_url
 *  - anchor  → scroll / jump to #target_id on the page
 *  - form    → open a form identified by form_key
 *  - youtube → open a YouTube video (target_url = watch / youtu.be / embed link)
 */
export const BUTTON_ACTION_TYPES = ["url", "anchor", "form", "youtube"];

/**
 * Fresh schema instance per call — Mongoose schemas must not be reused
 * across multiple parent paths (section.buttons vs item.buttons).
 */
export function createCmsButtonSchema() {
  return new Schema(
    {
      label: {
        type: String,
        required: [true, "Button label is required"],
        trim: true,
        maxlength: [80, "Label cannot exceed 80 characters"],
      },

      variant: {
        type: String,
        enum: {
          values: BUTTON_VARIANTS,
          message: `variant must be one of: ${BUTTON_VARIANTS.join(", ")}`,
        },
        default: "primary",
      },

      action_type: {
        type: String,
        enum: {
          values: BUTTON_ACTION_TYPES,
          message: `action_type must be one of: ${BUTTON_ACTION_TYPES.join(", ")}`,
        },
        default: "url",
      },

      /** action_type = url | youtube */
      target_url: { type: String, trim: true, default: "" },

      /** action_type = anchor — DOM id without leading # */
      target_id: { type: String, trim: true, default: "" },

      /** action_type = form — key into the form registry */
      form_key: { type: String, trim: true, default: "" },

      open_in_new_tab: { type: Boolean, default: false },

      sort_order: { type: Number, default: 0 },

      status: { type: Boolean, default: true },
    },
    { _id: true }
  );
}

export default createCmsButtonSchema();
