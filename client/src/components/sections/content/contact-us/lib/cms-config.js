/** CMS item config for contact_us section channels. */
export const CONTACT_US_ITEMS_CONFIG = {
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
      errors: { required: "Pick a channel type" },
    },
    { key: "title", type: "text", label: "Label", required: true },
    {
      key: "subtitle",
      type: "text",
      label: "Value (email, phone, address)",
      required: true,
    },
    { key: "body", type: "richtext", label: "Note (optional)" },
    { key: "href", type: "url", label: "Link (mailto:, tel:, maps…)" },
  ],
  preview: "contact_channel",
};
