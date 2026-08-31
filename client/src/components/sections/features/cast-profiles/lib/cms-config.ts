/** CMS item fields for `cast_profiles` — register in lib/sections/configs/index.js */
export const CAST_PROFILES_ITEMS_CONFIG = {
  label: "Cast profiles",
  actionLabel: "profiles",
  fields: [
    { key: "image_url", type: "image", label: "Portrait photo", required: true },
    { key: "value", type: "text", label: "Badge (e.g. Lead)" },
    { key: "title", type: "text", label: "Actor name", required: true },
    { key: "subtitle", type: "text", label: "Character name" },
    { key: "body", type: "richtext", label: "Short bio" },
  ],
  preview: "cast_profile",
};
