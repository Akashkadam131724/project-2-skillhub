/** CMS item fields for `contact_form` — register in lib/sections/configs/index.js */
export const CONTACT_FORM_ITEMS_CONFIG = {
  label: "Contact channels",
  actionLabel: "channels",
  fields: [
    {
      key: "icon",
      type: "select",
      label: "Type (email / phone / location)",
      required: true,
      options: [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "location", label: "Location" },
      ],
    },
    { key: "title", type: "text", label: "Label", required: true },
    { key: "subtitle", type: "text", label: "Value", required: true },
    { key: "body", type: "richtext", label: "Note (optional)" },
    { key: "href", type: "url", label: "Link (mailto:, tel:…)" },
  ],
  preview: "contact_channel",
};
