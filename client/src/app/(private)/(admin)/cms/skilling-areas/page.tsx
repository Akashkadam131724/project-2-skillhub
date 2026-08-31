"use client";

import { useState, type FormEvent } from "react";
import { fetchSkillingAreas } from "@/lib/api";
import {
  createSkillingArea,
  deleteSkillingArea,
  restoreSkillingArea,
  updateSkillingArea,
} from "@/lib/api/entity-cms-api";
import { cmsEditHref, cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import { nextToggleStatus } from "@/lib/cms/cms-list-filters";
import { useCmsEntityList } from "@/hooks/useCmsEntityList";
import CmsEntityListPanel from "@/components/cms/admin/CmsEntityListPanel";
import CmsEntityRowActions, {
  CmsEntityStatusBadge,
} from "@/components/cms/admin/CmsEntityRowActions";
import {
  cmsEntityListMetaClass,
  cmsEntityListPrimaryClass,
  cmsEntityListRowClass,
  cmsEntityListTitleClass,
} from "@/components/cms/admin/cms-entity-list-row";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
} from "@/components/cms/admin/CmsUi";
import type { CmsEntityListItem } from "@/components/cms/admin/types";
import type { SkillingAreaForm, SkillingAreaListItem } from "../entity-types";

const emptyForm: SkillingAreaForm = {
  name: "",
  description: "",
  status: "active",
  sortOrder: 0,
};

export default function CmsSkillingAreasPage() {
  const {
    filter,
    setFilter,
    page,
    setPage,
    limit,
    totalPages,
    items,
    total,
    loading,
    error,
    setError,
    onSearchChange,
    reload,
  } = useCmsEntityList<SkillingAreaListItem>(fetchSkillingAreas);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createSkillingArea({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
      });
      setForm(emptyForm);
      setShowForm(false);
      window.location.href = `/cms/skilling-area/${(res.data as SkillingAreaListItem).slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(item: SkillingAreaListItem) {
    try {
      await updateSkillingArea(String(item.slug), {
        status: nextToggleStatus(item.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(item: SkillingAreaListItem) {
    if (!confirm(`Delete skilling area "${item.name}"?`)) return;
    try {
      await deleteSkillingArea(String(item.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(item: SkillingAreaListItem) {
    try {
      await restoreSkillingArea(String(item.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="w-full">
      <CmsHeading
        title="Skilling areas"
        subtitle="Manage skilling area taxonomy used on courses and detail pages."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add skilling area"}
          </button>
        }
      />
      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New skilling area" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                className={inputClass}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                }
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create skilling area"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsEntityListPanel
        title="All skilling areas"
        items={items}
        loading={loading}
        total={total ?? 0}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={setFilter}
        searchPlaceholder="Search skilling areas…"
        renderItem={(item) => (
          <li key={item.slug} className={cmsEntityListRowClass()}>
            <div className={cmsEntityListPrimaryClass()}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cmsEntityListTitleClass()}>{item.name}</p>
                <CmsEntityStatusBadge item={item} />
              </div>
              <p className={cmsEntityListMetaClass()}>
                /skilling-area/{item.slug}
              </p>
            </div>
            <CmsEntityRowActions
              item={item}
              editHref={`/cms/skilling-area/${item.slug}`}
              publicHref={cmsPublicHref("skilling_area", String(item.slug))}
              liveEditHref={cmsEditHref("skilling_area", String(item.slug))}
              onToggleStatus={onToggleStatus as (item: CmsEntityListItem) => void}
              onDelete={onDelete as (item: CmsEntityListItem) => void}
              onRestore={onRestore as (item: CmsEntityListItem) => void}
            />
          </li>
        )}
      />
    </div>
  );
}
