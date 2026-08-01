/** UI helpers for CMS entity list rows (filter/search logic lives on the server). */

export const CMS_LIST_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled" },
  { id: "deleted", label: "Deleted" },
];

/** Query params for CMS list API — server resolves filter and search. */
export function buildCmsListQuery({
  q = "",
  filter = "all",
  limit = 100,
  page = 1,
  extra = {},
} = {}) {
  const params = {
    page,
    limit,
    filter,
    ...extra,
  };
  const search = String(q || "").trim();
  if (search) params.q = search;
  return params;
}

export function isItemDeleted(item) {
  return Boolean(item?.deletedAt);
}

export function nextToggleStatus(current) {
  return current === "active" ? "inactive" : "active";
}

export function statusLabel(item) {
  if (isItemDeleted(item)) return "deleted";
  return String(item?.status || "draft");
}

export function isStatusActive(item) {
  if (isItemDeleted(item)) return false;
  return item?.status === "active";
}
