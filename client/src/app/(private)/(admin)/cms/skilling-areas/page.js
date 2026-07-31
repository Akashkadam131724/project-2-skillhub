"use client";

import { useState } from "react";
import { fetchSkillingAreas } from "@/lib/api";
import {
  createSkillingArea,
  deleteSkillingArea,
  restoreSkillingArea,
  updateSkillingArea,
} from "@/lib/entity-cms-api";
import { cmsEditHref, cmsPublicHref } from "@/lib/cms-edit-routes";
import { nextToggleStatus } from "@/lib/cms-list-filters";
import { useCmsEntityList } from "@/hooks/useCmsEntityList";
import CmsEntityListPanel from "@/components/cms/CmsEntityListPanel";
import CmsEntityRowActions, {
  CmsEntityStatusBadge,
} from "@/components/cms/CmsEntityRowActions";
import {
  cmsEntityListMetaClass,
  cmsEntityListPrimaryClass,
  cmsEntityListRowClass,
  cmsEntityListTitleClass,
} from "@/components/cms/cms-entity-list-row";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
} from "@/components/cms/CmsUi";

const emptyForm = {
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
  } = useCmsEntityList(fetchSkillingAreas);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function onCreate(e) {
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
      window.location.href = `/cms/skilling-area/${res.data.slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(item) {
    try {
      await updateSkillingArea(item.slug, {
        status: nextToggleStatus(item.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(item) {
    if (!confirm(`Delete skilling area "${item.name}"?`)) return;
    try {
      await deleteSkillingArea(item.slug);
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(item) {
    try {
      await restoreSkillingArea(item.slug);
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
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
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
        total={total}
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
              publicHref={cmsPublicHref("skilling_area", item.slug)}
              liveEditHref={cmsEditHref("skilling_area", item.slug)}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          </li>
        )}
      />
    </div>
  );
}
