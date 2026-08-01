"use client";

import Link from "next/link";
import { StatusBadge, btnDanger, btnPrimary, btnSecondary } from "@/components/cms/admin/CmsUi";
import { isItemDeleted, statusLabel, isStatusActive } from "@/lib/cms/cms-list-filters";

export function CmsEntityStatusBadge({ item }) {
  if (isItemDeleted(item)) {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
        deleted
      </span>
    );
  }
  const label = statusLabel(item);
  return (
    <StatusBadge
      active={isStatusActive(item)}
      labelOn={label}
      labelOff={label}
    />
  );
}

/**
 * Standard row actions matching the content pages list.
 */
export default function CmsEntityRowActions({
  item,
  editHref,
  onEdit,
  publicHref,
  liveEditHref,
  onToggleStatus,
  onDelete,
  onRestore,
  canToggle = true,
  canDelete = true,
}) {
  const deleted = isItemDeleted(item);

  if (deleted) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {onRestore ? (
          <button
            type="button"
            className={`${btnPrimary} text-xs`}
            onClick={() => onRestore(item)}
          >
            Restore
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onEdit ? (
        <button type="button" className={`${btnSecondary} text-xs`} onClick={() => onEdit(item)}>
          Edit
        </button>
      ) : editHref ? (
        <Link href={editHref} className={`${btnSecondary} text-xs`}>
          Edit
        </Link>
      ) : null}
      {publicHref ? (
        <Link href={publicHref} className={`${btnSecondary} text-xs`}>
          View
        </Link>
      ) : null}
      {liveEditHref ? (
        <Link href={liveEditHref} className={`${btnPrimary} text-xs`}>
          Edit live
        </Link>
      ) : null}
      {canToggle && onToggleStatus ? (
        <button
          type="button"
          className={`${btnSecondary} text-xs`}
          onClick={() => onToggleStatus(item)}
        >
          {item.status === "active" ? "Disable" : "Enable"}
        </button>
      ) : null}
      {canDelete && onDelete ? (
        <button
          type="button"
          className={`${btnDanger} text-xs`}
          onClick={() => onDelete(item)}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
