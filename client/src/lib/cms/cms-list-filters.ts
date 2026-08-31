import type { CmsListFilterId } from "@/components/cms/admin/types";
import type { QueryParams } from "@/lib/api/types";

/** UI helpers for CMS entity list rows (filter/search logic lives on the server). */

export const CMS_LIST_FILTERS: Array<{ id: CmsListFilterId; label: string }> = [
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
}: {
  q?: string;
  filter?: CmsListFilterId;
  limit?: number;
  page?: number;
  extra?: QueryParams;
} = {}) {
  const params: QueryParams = {
    page,
    limit,
    filter,
    ...extra,
  };
  const search = String(q || "").trim();
  if (search) params.q = search;
  return params;
}

export function isItemDeleted(item: { deletedAt?: string | null }) {
  return Boolean(item?.deletedAt);
}

export function nextToggleStatus(current?: string) {
  return current === "active" ? "inactive" : "active";
}

export function statusLabel(item: { deletedAt?: string | null; status?: string }) {
  if (isItemDeleted(item)) return "deleted";
  return String(item?.status || "draft");
}

export function isStatusActive(item: { deletedAt?: string | null; status?: string }) {
  if (isItemDeleted(item)) return false;
  return item?.status === "active";
}
