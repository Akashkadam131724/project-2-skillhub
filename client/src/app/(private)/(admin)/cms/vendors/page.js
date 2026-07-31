"use client";

import { useState } from "react";
import { fetchVendors } from "@/lib/api";
import {
  createVendor,
  deleteVendor,
  restoreVendor,
  updateVendor,
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
  email: "",
  phone: "",
  status: "active",
  shortDescription: "",
  description: "",
  logoUrl: "",
};

export default function CmsVendorsPage() {
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
  } = useCmsEntityList(fetchVendors);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createVendor({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        status: form.status,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        logoUrl: form.logoUrl.trim() || null,
      });
      setForm(emptyForm);
      setShowForm(false);
      await reload();
      window.location.href = `/cms/vendor/${res.data.slug}`;
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(vendor) {
    try {
      await updateVendor(vendor.slug, {
        status: nextToggleStatus(vendor.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(vendor) {
    if (!confirm(`Delete vendor "${vendor.name}"?`)) return;
    try {
      await deleteVendor(vendor.slug);
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(vendor) {
    try {
      await restoreVendor(vendor.slug);
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="w-full">
      <CmsHeading
        title="Vendors"
        subtitle="Add and edit vendors. Use Edit live to customize page sections for one vendor."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add vendor"}
          </button>
        }
      />

      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New vendor" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            <Field label="Phone" hint="10-digit Indian number">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
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
                <option value="pending">pending</option>
              </select>
            </Field>
            <Field label="Short description" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                }
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <Field label="Logo URL" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.logoUrl}
                onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                placeholder="https://… or /uploads/…"
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create vendor"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsEntityListPanel
        title="All vendors"
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
        searchPlaceholder="Search vendors…"
        renderItem={(vendor) => (
          <li key={vendor.slug} className={cmsEntityListRowClass()}>
            <div className={cmsEntityListPrimaryClass()}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cmsEntityListTitleClass()}>{vendor.name}</p>
                <CmsEntityStatusBadge item={vendor} />
              </div>
              <p className={cmsEntityListMetaClass()}>
                {vendor.email} · /vendor/{vendor.slug}
              </p>
            </div>
            <CmsEntityRowActions
              item={vendor}
              editHref={`/cms/vendor/${vendor.slug}`}
              publicHref={cmsPublicHref("vendor", vendor.slug)}
              liveEditHref={cmsEditHref("vendor", vendor.slug)}
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
