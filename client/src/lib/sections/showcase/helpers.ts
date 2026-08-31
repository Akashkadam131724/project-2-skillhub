/** Static showcase helpers — sample buttons and list items */

export function showcaseBtn(
  label: string,
  opts: Record<string, unknown> = {}
) {
  return {
    label,
    variant: opts.variant || "primary",
    action_type: opts.action_type || "url",
    target_url: opts.target_url || "",
    target_id: opts.target_id || "",
    form_key: opts.form_key || "",
    open_in_new_tab: Boolean(opts.open_in_new_tab),
    sort_order: opts.sort_order ?? 0,
    status: opts.status !== false,
  };
}

export function showcaseItem(
  fields: Record<string, unknown> = {},
  i = 0
) {
  return {
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: "",
    icon: "",
    href: "",
    item_type: "",
    parent_id: "",
    buttons: [],
    sort_order: i,
    status: true,
    ...fields,
  };
}

export function showcaseTabId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
