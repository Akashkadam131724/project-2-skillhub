/** CMS item config for `team` — register in lib/sections/configs/index.js */
export const TEAM_ITEMS_CONFIG = {
  label: "Team members",
  actionLabel: "members",
  fields: [
    { key: "image_url", type: "image", label: "Photo", required: true },
    { key: "title", type: "text", label: "Name", required: true },
    { key: "subtitle", type: "text", label: "Role / title" },
    { key: "body", type: "richtext", label: "Short bio" },
  ],
  preview: "team_member",
};
