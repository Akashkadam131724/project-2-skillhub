import { Schema } from "mongoose";

/** Visual style of the button */
export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
  "inverse",
  "danger",
];

export const BUTTON_SIZES = ["sm", "md", "lg"];

export const BUTTON_SHAPES = ["rounded", "pill", "square"];

/**
 * Icon preset — "auto" derives from action; "none" hides icon.
 * See client/src/lib/ui/button-icon-catalog.js for the full list.
 */
export const BUTTON_ICON_PRESETS = [
  "auto",
  "none",
  "arrow-right",
  "arrow-left",
  "arrow-down",
  "arrow-up",
  "chevron-right",
  "chevron-left",
  "chevron-down",
  "chevron-up",
  "external",
  "link",
  "download",
  "pdf",
  "file",
  "share",
  "play",
  "youtube",
  "mail",
  "phone",
  "map-pin",
  "form",
  "chat",
  "cart",
  "check",
  "plus",
  "minus",
  "search",
  "calendar",
  "clock",
  "book",
  "graduation",
  "building",
  "globe",
  "star",
  "sparkle",
  "user",
  "settings",
  "info",
  "heart",
];

export const BUTTON_ICON_POSITIONS = ["start", "end"];

/**
 * What the button does when clicked:
 *  - url        → navigate to target_url
 *  - anchor     → scroll / jump to #target_id on the page
 *  - form       → open a form identified by form_key
 *  - youtube    → open a YouTube video (target_url)
 *  - email      → mailto: target_url (email address)
 *  - phone      → tel: target_url (phone number)
 *  - download   → download file at target_url
 *  - scroll_top → scroll window to top
 */
export const BUTTON_ACTION_TYPES = [
  "url",
  "anchor",
  "form",
  "youtube",
  "email",
  "phone",
  "download",
  "scroll_top",
];

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

      size: {
        type: String,
        enum: {
          values: BUTTON_SIZES,
          message: `size must be one of: ${BUTTON_SIZES.join(", ")}`,
        },
        default: "md",
      },

      shape: {
        type: String,
        enum: {
          values: BUTTON_SHAPES,
          message: `shape must be one of: ${BUTTON_SHAPES.join(", ")}`,
        },
        default: "rounded",
      },

      icon: {
        type: String,
        trim: true,
        default: "auto",
      },

      icon_position: {
        type: String,
        enum: {
          values: BUTTON_ICON_POSITIONS,
          message: `icon_position must be one of: ${BUTTON_ICON_POSITIONS.join(", ")}`,
        },
        default: "start",
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

      full_width: { type: Boolean, default: false },

      /** Optional override when label alone is insufficient */
      aria_label: { type: String, trim: true, default: "" },

      /** action_type = download — suggested filename */
      download_filename: { type: String, trim: true, default: "" },

      /** Tailwind !-classes — override variant tokens (see button-class-catalog.js) */
      cls_bg: { type: String, trim: true, default: "" },
      cls_text: { type: String, trim: true, default: "" },
      cls_border: { type: String, trim: true, default: "" },
      cls_hover_bg: { type: String, trim: true, default: "" },
      cls_hover_text: { type: String, trim: true, default: "" },
      cls_hover_border: { type: String, trim: true, default: "" },

      sort_order: { type: Number, default: 0 },

      status: { type: Boolean, default: true },
    },
    { _id: true }
  );
}

export default createCmsButtonSchema();
