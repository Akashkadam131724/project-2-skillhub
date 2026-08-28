/** Shared nested-tab CMS fields for feature_tabs / tabs_* variants */
export const NESTED_TABS_ITEM_FIELDS = [
  { key: "image_url", type: "image", label: "Preview image" },
  { key: "value", type: "text", label: "Tab label / count" },
  { key: "title", type: "text", label: "Title" },
  { key: "subtitle", type: "text", label: "Subtitle" },
  { key: "body", type: "richtext", label: "Description" },
  { key: "buttons", type: "buttons", label: "Buttons" },
];

export const NESTED_TABS_CHILD_FIELDS = [
  { key: "image_url", type: "image", label: "Card image" },
  { key: "title", type: "text", label: "Card title" },
  { key: "subtitle", type: "text", label: "Subtitle" },
  { key: "body", type: "richtext", label: "Description" },
  { key: "href", type: "url", label: "Link URL" },
  { key: "buttons", type: "buttons", label: "Buttons" },
];

export function nestedTabsItemsConfig(label, actionLabel = "tabs") {
  return {
    label,
    actionLabel,
    nestedTabs: true,
    fields: NESTED_TABS_ITEM_FIELDS,
    childFields: NESTED_TABS_CHILD_FIELDS,
    preview: "feature_tab",
  };
}
