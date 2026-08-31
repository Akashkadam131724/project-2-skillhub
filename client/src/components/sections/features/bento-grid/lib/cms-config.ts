/** CMS item fields for `bento_grid` — register in lib/sections/configs/index.js */
export const BENTO_GRID_ITEMS_CONFIG = {
  label: "Bento cells",
  actionLabel: "cells",
  fields: [
    { key: "image_url", type: "image", label: "Background image" },
    { key: "value", type: "text", label: "Metric / label" },
    { key: "title", type: "text", label: "Title" },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "bento_cell",
};
